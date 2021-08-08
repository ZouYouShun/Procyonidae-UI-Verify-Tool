import { ElectronContextBridge } from '@procyonidae/api-interfaces';
import { ipcMain, ipcRenderer } from 'electron';

import { screenIpcKeys } from './screenIpcKeys';
import { ScreenshotWindow } from './screenshots';

export type ScreenKey = 'screen';

export type ScreenContextBridge = ElectronContextBridge[ScreenKey];

export const getScreenContextBridge = () => {
  const screen: ScreenContextBridge = {
    open: () => ipcRenderer.invoke(screenIpcKeys.open),
    confirmCapture: (url) => {
      ipcRenderer.invoke(screenIpcKeys.confirmCapture, url);
    },
    onReady: (cb) => {
      ipcRenderer.on(screenIpcKeys.onReady, (e, data) => cb(data));

      return () => {
        ipcRenderer.removeListener(screenIpcKeys.onReady, cb);
      };
    },
    onConfirmCapture: (cb) => {
      ipcRenderer.on(screenIpcKeys.onConfirmCapture, (e, data) => {
        cb(data);
      });

      return () => {
        ipcRenderer.removeListener(screenIpcKeys.onConfirmCapture, cb);
      };
    },
  };

  return { screen };
};

export const bindScreenIpcListeners = () => {
  ipcMain.handle(screenIpcKeys.open, () => {
    const screenshotWindow = ScreenshotWindow.getInstance();

    screenshotWindow.startCapture();

    return true;
  });

  ipcMain.handle(screenIpcKeys.confirmCapture, (e, url: string) => {
    const screenshotWindow = ScreenshotWindow.getInstance();

    screenshotWindow.endCapture(url);

    return true;
  });
};
