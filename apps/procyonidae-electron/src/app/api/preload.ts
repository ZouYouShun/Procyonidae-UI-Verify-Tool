import { ContextBridgeMap } from '@procyonidae/api-interfaces';
import { getScreenContextBridge } from '@procyonidae/electron/screen';
import { getSettingsContextBridge } from '@procyonidae/electron/settings';
import { getSnippetContextBridge } from '@procyonidae/electron/snippet';
import { getSpeechToTextContextBridge } from '@procyonidae/electron/speech-to-text';
import { contextBridge, ipcRenderer } from 'electron';

const electron: ContextBridgeMap['electron'] = {
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('root:getAppVersion'),
  hide: () => ipcRenderer.invoke('root:hide'),
  ...getScreenContextBridge(),
  ...getSnippetContextBridge(),
  ...getSettingsContextBridge(),
  ...getSpeechToTextContextBridge(),
};

contextBridge.exposeInMainWorld('electron', electron);
