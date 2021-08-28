import speech from '@google-cloud/speech';
import { execSync } from 'child_process';
import { SpeechToTextResponse } from '@procyonidae/api-interfaces';
import { app, dialog } from 'electron';
import fs from 'fs-extra';
import os from 'os';
import path, { join } from 'path';
import FileType from 'file-type';

import type { google } from '@google-cloud/speech/build/protos/protos';

function pad(num: number, size = 2) {
  let s = `${num}`;
  while (s.length < size) {
    s = `0${s}`;
  }
  return s;
}

const getTimeString = (secs: number) => {
  const hours = Math.floor(secs / (60 * 60));
  const minutes = Math.floor((secs % (60 * 60)) / 60);
  const seconds = Math.floor(secs % 60);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const oneNanosecond = Math.pow(10, 9);
const getNanosecondString = (nanoseconds: number) => {
  return (nanoseconds / oneNanosecond).toFixed(3).slice(2);
};

export class SpeechToText {
  rootPath = app.getAppPath();

  serviceAccountPath = join(this.rootPath, 'system/service_account.json');

  init() {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = this.serviceAccountPath;
  }

  async setServiceAccountPath() {
    const filePath = await this.selectFile();

    try {
      const serviceAccount = fs.readJSONSync(filePath);
      if ('type' in serviceAccount && 'project_id' in serviceAccount) {
        fs.ensureDirSync(path.dirname(this.serviceAccountPath));
        fs.copyFileSync(filePath, this.serviceAccountPath);
      }
    } catch (error) {
      console.log(error);
    }
  }

  videoToAudio() {}

  async selectFile() {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });

    if (result.filePaths && result.filePaths?.length > 0) {
      const sourcePath = result.filePaths[0];
      let outputPath = sourcePath;
      const fileParse = path.parse(sourcePath);

      const type = await FileType.fromFile(sourcePath);
      if (type.mime.includes('video')) {
        const targetPath = path.join(fileParse.dir, `${fileParse.name}.wav`);

        execSync(
          [
            path.join(this.rootPath, './assets/ffmpeg'),
            '-y',
            '-i',
            sourcePath,
            // sampleRateHertz
            '-ar 16000',
            // audio_channel_count
            '-ac 1',
            targetPath,
          ].join(' '),
        );
        outputPath = targetPath;
      }

      return outputPath;
    }

    return '';
  }

  getSavePath() {
    const result = dialog.showSaveDialogSync({
      defaultPath: 'example.srt',
    });

    return result;
  }

  async saveFile(list: SpeechToTextResponse[]) {
    const savePath = this.getSavePath();

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
    }
    return 'fail';
  }

  async getTextFromAudio(filePath: string) {
    // console.log(__dirname);
    // const response = fs.readJsonSync(__dirname + '/assets/speech.json');

    // console.log(response);
    // return response;
    const client = new speech.SpeechClient();

    const file = fs.readFileSync(filePath);
    // TODO: switch to upload to Cloud Storage, and send link here.
    // TODO: that should switch to cloud function run, because that maybe a long run method.

    // https://stackoverflow.com/questions/46508055/using-ffmpeg-to-cut-audio-from-to-position
    // TODO: ffmpeg -i input.MP4 output.wav
    // TODO: ffmpeg -ss 0 -to 60 -i input.wav output.wav
    // from 60
    //ffmpeg -ss 60 -to 70 -i vllo.wav vllo1.wav

    try {
      // const [response] = await client.longRunningRecognize({
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
          // fs.w

          return null;
        }

        return response;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  responseToString(response: google.cloud.speech.v1.IRecognizeResponse) {
    const text = response.results
      ?.map((x) => {
        return x.alternatives
          ?.map((alternatives) => alternatives.transcript)
          .join('\n');
      })
      .join();

    return text;
  }

  responseToSrt(
    response: google.cloud.speech.v1.IRecognizeResponse,
  ): SpeechToTextResponse[] {
    const list = response.results.map((x) => {
      const alternative = x.alternatives[0];
      const words = alternative.words;

      const from = words[0].startTime;
      const to = words[words.length - 1].endTime;
      const transcript = alternative.transcript.trim();

      return {
        from,
        to,
        transcript,
      };
    });

    // TODO: split time with to large alternative

    const getString = (duration: google.protobuf.IDuration) => {
      const timeString = getTimeString(+duration.seconds);
      const nanoString = getNanosecondString(duration.nanos);

      return `${timeString},${nanoString}`;
    };

    return list.map((item, i) => {
      return {
        index: `${i + 1}`,
        from: getString(item.from),
        to: getString(item.to),
        transcript: item.transcript,
      };
    });
  }

  private static instance?: SpeechToText;

  static getInstance(): SpeechToText {
    if (!SpeechToText.instance) {
      SpeechToText.instance = new SpeechToText();
    }
    return SpeechToText.instance;
  }
}
