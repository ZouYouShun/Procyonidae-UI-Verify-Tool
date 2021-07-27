import { ipcRenderer } from 'electron';

const ipcBridge = {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  ipcRenderer,
  platform: process.platform,
};
