import { getIpcBridge } from '@procyonidae/electron/ipc-transport';
import { contextBridge, ipcRenderer } from 'electron';

const ipcBridge = getIpcBridge();

contextBridge.exposeInMainWorld('electron', ipcBridge);
