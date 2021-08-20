import speech from '@google-cloud/speech';
import { dialog } from 'electron';
import fs from 'fs';

export class SpeechToText {
  async selectFile() {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });

    if (result.filePaths && result.filePaths?.length > 0) {
      return { text: await this.getTextFromAudio(result.filePaths[0]) };
    }

    return { text: '' };
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
        languageCode: 'cmn-Hant-TW',
        model: 'default',
      },
    });

    if (response) {
      const text = response.results
        ?.map((x) => {
          return x.alternatives
            ?.map((alternatives) => alternatives.transcript)
            .join('\n');
        })
        .join();
      return text;
    }

    return '';
  }

  private static instance?: SpeechToText;

  static getInstance(): SpeechToText {
    if (!SpeechToText.instance) {
      SpeechToText.instance = new SpeechToText();
    }
    return SpeechToText.instance;
  }
}
