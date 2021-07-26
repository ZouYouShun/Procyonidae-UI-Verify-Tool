import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,

  screenshots: {
    open: () => {
      ipcRenderer.send('SCREENSHOTS::OPEN');

      return new Promise((resolve, reject) => {
        ipcRenderer.once('SCREENSHOTS::OK', (e, { dataURL }) => {
          resolve({ dataURL });
        });
        ipcRenderer.once('SCREENSHOTS::CANCEL', () => {
          reject();
        });
      });
    },
  },
});
