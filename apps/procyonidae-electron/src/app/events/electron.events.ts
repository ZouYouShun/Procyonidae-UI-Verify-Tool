import { ScreenshotWindow } from '@procyonidae/electron/screen';
import { app, ipcMain } from 'electron';

import { environment } from '../../environments/environment';
import App from '../app';

/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

export default class ElectronEvents {
  static bootstrapElectronEvents() {
    return ipcMain;
  }
}

// Retrieve app version
ipcMain.handle('root:getAppVersion', (event) => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

ipcMain.handle('screen:takeScreenshot', async (event) => {
  const screenshotWindow = ScreenshotWindow.getInstance();

  screenshotWindow.startCapture();

  return true;
});

ipcMain.handle('screen:getScreenshotImage', async (event) => {
  const screenshotWindow = ScreenshotWindow.getInstance();

  const img = await screenshotWindow.getScreenshotImage();

  return img;
});

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});

// Handle App termination
ipcMain.on('cool', (event, code) => {
  console.log(event, code);
});
