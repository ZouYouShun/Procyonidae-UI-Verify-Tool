import speech from '@google-cloud/speech';
import type { google } from '@google-cloud/speech/build/protos/protos';
import { dialog } from 'electron';
import fs from 'fs-extra';

export class SpeechToText {
  async selectFile() {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });

    if (result.filePaths && result.filePaths?.length > 0) {
      return result.filePaths[0];
    }
    return '';
  }

  async getTextFromAudio(filePath: string) {
    const client = new speech.SpeechClient();

    const file = fs.readFileSync(filePath);

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

  private static instance?: SpeechToText;

  static getInstance(): SpeechToText {
    if (!SpeechToText.instance) {
      SpeechToText.instance = new SpeechToText();
    }
    return SpeechToText.instance;
  }
}
