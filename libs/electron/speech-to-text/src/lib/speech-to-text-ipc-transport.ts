import { ElectronContextBridge } from '@procyonidae/api-interfaces';
import { ipcMain, ipcRenderer } from 'electron';

import { SpeechToText } from './speech-to-text';
import { SpeechToTextIpcKeys } from './speech-to-text-ipc-keys';

export type SpeechToTextKey = 'speechToText';

export type SpeechToTextContextBridge = ElectronContextBridge[SpeechToTextKey];

export const getSpeechToTextContextBridge = () => {
  const speechToText: SpeechToTextContextBridge = {
    selectFile: () => ipcRenderer.invoke(SpeechToTextIpcKeys.selectFile),
    setServiceAccountFile: () =>
      ipcRenderer.invoke(SpeechToTextIpcKeys.setServiceAccountFile),
  };

  return { speechToText };
};

export const bindSpeechToTextIpcListeners = () => {
  ipcMain.handle(SpeechToTextIpcKeys.selectFile, async (e, value: string) => {
    const speechToText = SpeechToText.getInstance();

    const filePath = await speechToText.selectFile();

    if (filePath) {
      const result = await speechToText.getTextFromAudio(filePath);
      const text = speechToText.responseToString(result);

      return { result, text };
    }

    return { result: [], text: '' };
  });

  ipcMain.handle(SpeechToTextIpcKeys.setServiceAccountFile, (e) => {
    const speechToText = SpeechToText.getInstance();

    speechToText.setServiceAccountPath();

    return true;
  });
};
