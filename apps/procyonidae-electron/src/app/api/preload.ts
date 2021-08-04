import { getIpcBridge } from '@procyonidae/electron/ipc-transport';
import { contextBridge, ipcRenderer } from 'electron';

const ipcBridge = getIpcBridge();

contextBridge.exposeInMainWorld('electron', ipcBridge);

// const ipcBridge2 = getIpcBridge();
// contextBridge.exposeInMainWorld('electron2', ipcBridge2);
