import { ElectronContextBridge } from '@procyonidae/api-interfaces';
import { ipcMain, ipcRenderer } from 'electron';
import { SettingsWindow } from './settings.window';

import { SettingsIpcKeys } from './settingsIpcKeys';

export type SettingsKey = 'settings';

export type SettingsContextBridge = ElectronContextBridge[SettingsKey];

export const getSettingsContextBridge = () => {
  const settings: SettingsContextBridge = {
    open: () => ipcRenderer.invoke(SettingsIpcKeys.open),
  };

  return { settings };
};

export const bindSettingsIpcListeners = () => {
  ipcMain.handle(SettingsIpcKeys.open, (e, value: string) => {
    const settingsWindow = SettingsWindow.getInstance();
    settingsWindow.open();
    return true;
  });
};
