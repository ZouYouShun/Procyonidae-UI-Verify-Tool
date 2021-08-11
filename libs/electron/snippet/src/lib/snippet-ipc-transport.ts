import { ElectronContextBridge } from '@procyonidae/api-interfaces';
import { clipboard, ipcMain, ipcRenderer } from 'electron';

import { SnippetIpcKeys } from './snippetIpcKeys';

// import robot from 'robotjs';

export type SnippetKey = 'snippet';

export type SnippetContextBridge = ElectronContextBridge[SnippetKey];

export const getSnippetContextBridge = () => {
  const snippet: SnippetContextBridge = {
    confirm: (value) => ipcRenderer.invoke(SnippetIpcKeys.confirm, value),
    setHeight: (value) => ipcRenderer.invoke(SnippetIpcKeys.setHeight, value),
  };

  return { snippet };
};

export const bindSnippetIpcListeners = (
  onHeightChange: (height: number) => void,
) => {
  ipcMain.handle(SnippetIpcKeys.confirm, (e, value: string) => {
    clipboard.writeText(value);

    // setTimeout(() => {
    //   robot.typeString(value);
    // }, 50);

    return true;
  });

  ipcMain.handle(SnippetIpcKeys.setHeight, (e, value: number) => {
    onHeightChange(value);

    // setTimeout(() => {
    //   robot.typeString(value);
    // }, 50);

    return true;
  });
};
