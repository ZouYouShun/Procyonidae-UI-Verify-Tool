import { RendererTransport } from '@procyonidae/electron/ipc-transport';
import { contextBridge, ipcRenderer } from 'electron';

const transport = new RendererTransport({
  ipcRenderer,
});

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  getAppVersion: () => transport.getAppVersion(),
  takeScreenshot: async () => {
    const img = await transport.takeScreenshot();

    return img;
  },
});
