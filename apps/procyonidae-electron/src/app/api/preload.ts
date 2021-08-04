import { getIpcBridge } from '@procyonidae/electron/ipc-transport';
import { contextBridge } from 'electron';

const ipcBridge = getIpcBridge();

contextBridge.exposeInMainWorld('electron', ipcBridge);
