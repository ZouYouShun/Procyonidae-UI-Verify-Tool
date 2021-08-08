import { ContextBridgeMap } from '@procyonidae/api-interfaces';
import { getScreenContextBridge } from '@procyonidae/electron/screen';
import { contextBridge, ipcRenderer } from 'electron';

const electron: ContextBridgeMap['electron'] = {
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('root:getAppVersion'),
  ...getScreenContextBridge(),
};

contextBridge.exposeInMainWorld('electron', electron);
