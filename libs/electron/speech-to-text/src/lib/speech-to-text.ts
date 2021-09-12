import speech from '@google-cloud/speech';
import { SpeechToTextResponse } from '@procyonidae/api-interfaces';
import { getAppPath } from '@procyonidae/electron/shared/utils';
import { ffmpegSync } from '@procyonidae/ffmpeg';
import { getFullTimeString } from '@procyonidae/shared/utils';
import { dialog, shell } from 'electron';
import FileType from 'file-type';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import type { google } from '@google-cloud/speech/build/protos/protos';

const MB = 1024 * 1024;
const ONE_MINTIER = 60;

export class SpeechToText {
  rootPath = getAppPath();

  serviceAccountPath = path.join(this.rootPath, 'system/service_account.json');
  speechTmpDirPath = path.join(this.rootPath, 'speech');

  init() {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = this.serviceAccountPath;

    this.ensureDirSync();
  }

  private ensureDirSync() {
    [path.dirname(this.serviceAccountPath), this.speechTmpDirPath].forEach(
      (x) => fs.ensureDirSync(x),
    );
  }

  private getSavePath(filename: string) {
    const result = dialog.showSaveDialogSync({
      defaultPath: `${filename}.srt`,
    });

    return result;
  }

  async clearTmp() {
    await fs.remove(this.speechTmpDirPath);
    this.ensureDirSync();
  }

  async setServiceAccountPath() {
    const filePath = await this.selectFile();

    const serviceAccount = fs.readJSONSync(filePath);
    if ('type' in serviceAccount && 'project_id' in serviceAccount) {
      fs.copyFileSync(filePath, this.serviceAccountPath);
    }
  }

  async selectFile() {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });

    if (result.filePaths && result.filePaths?.length > 0) {
      const sourcePath = result.filePaths[0];

      return sourcePath;
    }

    return '';
  }

  async transpileFile(sourcePath: string) {
    let outputPath = sourcePath;
    const fileParse = path.parse(sourcePath);

    const stat = fs.statSync(outputPath);

    const result = ffmpegSync([
      '-i',
      `"${sourcePath}"`,
      `2>&1 | grep Duration | awk '{print $2}' | tr -d ,`,
    ]);

    const [hour, min, seconds] = result.split(':') as any as [
      string,
      string,
      string,
    ];

    const second = +hour * 60 * 60 + +min * 60 + +seconds;

    if (stat.size > MB * 10 || second > ONE_MINTIER) {
      const outputPathArr: string[] = [];

      const count = Math.ceil(second / ONE_MINTIER);

      for (let i = 0; i < count; i++) {
        const targetPath = path.join(
          this.speechTmpDirPath,
          `${fileParse.name}_${i}.wav`,
        );

        ffmpegSync([
          '-y',
          '-i',
          `"${sourcePath}"`,
          `-ss '${i * ONE_MINTIER}ms' -t '${ONE_MINTIER - 1000}ms'`,
          // sampleRateHertz
          '-ar 16000',
          // audio_channel_count
          '-ac 1',
          `"${targetPath}"`,
        ]);

        outputPathArr.push(targetPath);
      }

      return outputPathArr;
    }

    const type = await FileType.fromFile(sourcePath);

    if (type.mime.includes('video')) {
      const targetPath = path.join(
        this.speechTmpDirPath,
        `${fileParse.name}.wav`,
      );

      ffmpegSync([
        '-y',
        '-i',
        `"${sourcePath}"`,
        // sampleRateHertz
        '-ar 16000',
        // audio_channel_count
        '-ac 1',
        `"${targetPath}"`,
      ]);

      return targetPath;
    }

    return outputPath;
  }

  async saveFile(filename: string, list: SpeechToTextResponse[]) {
    const savePath = this.getSavePath(filename);

    if (!savePath) return;

    try {
      const template = list
        .map(({ from, index, to, transcript }, i) => {
          return [`${index}`, `${from} --> ${to}`, transcript].join(os.EOL);
        })
        .join(`${os.EOL}${os.EOL}`);

      fs.writeFileSync(savePath, template);
      return savePath;
    } catch (error) {
      console.log(error);
      return 'fail';
    }
  }

  openItemInFolder(filePath: string) {
    shell.showItemInFolder(filePath);
  }

  async getTextFromAudio(filePath: string) {
    const client = new speech.SpeechClient();

    const file = fs.readFileSync(filePath);

    try {
      const [response] = await client.recognize({
        audio: {
          content: file,
        },
        config: {
          enableAutomaticPunctuation: true,
          sampleRateHertz: 16000,
          encoding: 'LINEAR16',
          enableWordTimeOffsets: true,
          languageCode: 'cmn-Hant-TW',
          model: 'default',
        },
      });

      if (response) {
        if (response.results.length === 0) {
          // TODO When fail write file log
          return null;
        }

        return response;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  getSrt(responses: google.cloud.speech.v1.IRecognizeResponse[]) {
    const { words, transcript } = responses.reduce(
      (acc, curr, i) => {
        curr.results.map((result) => {
          result.alternatives.map((alternative) => {
            acc.words.push(
              ...alternative.words.map((x) => {
                return {
                  ...x,
                  startTime: {
                    ...x.startTime,
                    seconds: `${+x.startTime.seconds + i * 60}`,
                  },
                  endTime: {
                    ...x.endTime,
                    seconds: `${+x.endTime.seconds + i * 60}`,
                  },
                };
              }),
            );
            acc.transcript = acc.transcript + alternative.transcript.trim();
          });
        });

        return acc;
      },
      {
        words: [] as google.cloud.speech.v1.IWordInfo[],
        transcript: '',
      },
    );

    let wordIndex = 0;
    let startIndex = 0;

    let currTranscript = '';

    const toList: SpeechToTextResponse[] = [];

    transcript.split('').forEach((text, i) => {
      // split with chinese words
      const checkRegex =
        /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/gm;
      // https://codertw.com/%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC/271625/
      if (checkRegex.test(text)) {
        wordIndex++;
        try {
          toList.push({
            index: `${wordIndex}`,
            from: getFullTimeString(words[startIndex].startTime),
            to: getFullTimeString(words[i - 1 - wordIndex].endTime),
            transcript: currTranscript,
          });
        } catch (error) {
          console.log(error);
        }
        startIndex = 0;
        currTranscript = '';
      } else {
        if (currTranscript === '') {
          startIndex = i - wordIndex;
        }
        currTranscript += text;
      }
    });

    return { text: transcript, data: toList };
  }

  private static instance?: SpeechToText;

  static getInstance(): SpeechToText {
    if (!SpeechToText.instance) {
      SpeechToText.instance = new SpeechToText();
    }
    return SpeechToText.instance;
  }
}
