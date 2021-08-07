import { ContextBridgeMap } from '@procyonidae/api-interfaces';
import { contextBridge, ipcRenderer } from 'electron';

const getContextBridge = <T extends keyof ContextBridgeMap>(
  key: T,
  value: ContextBridgeMap[T],
) => {
  return [key, value] as const;
};

contextBridge.exposeInMainWorld(
  ...getContextBridge('electron', {
    platform: process.platform,
    getAppVersion: () => ipcRenderer.invoke('root:getAppVersion'),
    takeScreenshot: () => {
      ipcRenderer.invoke('screen:takeScreenshot');
    },
    getScreenshotImage: () => {
      return ipcRenderer.invoke('screen:getScreenshotImage');
    },
    onOpenScreenshot: (cb) => {
      console.log('!!!');
      const key = 'screen:openScreenshot';
      ipcRenderer.on(key, (e, data) => {
        cb(data);
      });

      return () => {
        ipcRenderer.removeListener(key, cb);
      };
    },
  }),
);

// const ipcBridge2 = getIpcBridge();
// contextBridge.exposeInMainWorld('electron2', ipcBridge2);
