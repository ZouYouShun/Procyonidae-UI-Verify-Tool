import {
  ElectronContextBridge,
  SpeechToTextResponse,
} from '@procyonidae/api-interfaces';
import { ipcMain, ipcRenderer } from 'electron';
import path from 'path';

import { SpeechToText } from './speech-to-text';
import { SpeechToTextIpcKeys } from './speech-to-text-ipc-keys';

export type SpeechToTextKey = 'speechToText';

export type SpeechToTextContextBridge = ElectronContextBridge[SpeechToTextKey];

export const getSpeechToTextContextBridge = () => {
  const speechToText: SpeechToTextContextBridge = {
    selectFile: () => ipcRenderer.invoke(SpeechToTextIpcKeys.selectFile),
    saveFile: (filename, list) =>
      ipcRenderer.invoke(SpeechToTextIpcKeys.saveFile, filename, list),
    setServiceAccountFile: () =>
      ipcRenderer.invoke(SpeechToTextIpcKeys.setServiceAccountFile),
  };

  return { speechToText };
};

export const bindSpeechToTextIpcListeners = () => {
  ipcMain.handle(SpeechToTextIpcKeys.selectFile, async (e, value: string) => {
    const speechToText = SpeechToText.getInstance();

    const sourcePath = await speechToText.selectFile();
    const source = path.parse(sourcePath);

    if (sourcePath) {
      const transpileResult = await speechToText.transpileFile(sourcePath);

      if (transpileResult instanceof Array) {
        const results = await Promise.all(
          transpileResult.map((x) => speechToText.getTextFromAudio(x)),
        );

        return speechToText.getSrt(results);
      }

      const result = await speechToText.getTextFromAudio(transpileResult);

      speechToText.clearTmp();

      const values = speechToText.getSrt([result]);

      return { ...values, source };
    }

    return { text: '', data: [], source };
  });

  ipcMain.handle(
    SpeechToTextIpcKeys.saveFile,
    async (e, filename, list: SpeechToTextResponse[]) => {
      const speechToText = SpeechToText.getInstance();

      const filePath = await speechToText.saveFile(filename, list);

      speechToText.openItemInFolder(filePath);

      return filePath;
    },
  );

  ipcMain.handle(SpeechToTextIpcKeys.setServiceAccountFile, (e) => {
    const speechToText = SpeechToText.getInstance();

    speechToText.setServiceAccountPath();

    return true;
  });
};
