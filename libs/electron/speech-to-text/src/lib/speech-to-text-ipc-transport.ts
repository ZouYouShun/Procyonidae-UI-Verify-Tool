import { ElectronContextBridge } from '@procyonidae/api-interfaces';
import { ipcMain, ipcRenderer } from 'electron';

import { SpeechToText } from './speech-to-text';
import { SpeechToTextIpcKeys } from './speech-to-text-ipc-keys';

export type SpeechToTextKey = 'speechToText';

export type SpeechToTextContextBridge = ElectronContextBridge[SpeechToTextKey];

export const getSpeechToTextContextBridge = () => {
  const speechToText: SpeechToTextContextBridge = {
    selectFile: () => ipcRenderer.invoke(SpeechToTextIpcKeys.selectFile),
  };

  return { speechToText };
};

export const bindSpeechToTextIpcListeners = () => {
  ipcMain.handle(SpeechToTextIpcKeys.selectFile, (e, value: string) => {
    const speechToText = SpeechToText.getInstance();

    return speechToText.selectFile();
  });
  // ipcMain.handle(SpeechToTextIpcKeys.setHeight, (e, value: number) => {
  //   onHeightChange(value);
  //   // setTimeout(() => {
  //   //   robot.typeString(value);
  //   // }, 50);
  //   return true;
  // });
};
