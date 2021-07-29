import { MainTransport } from '@procyonidae/electron/ipc-transport';
import { app, ipcMain } from 'electron';

import { environment } from '../../environments/environment';
import App from '../app';

/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

export default class ElectronEvents {
  static transport: MainTransport;

  static bootstrapElectronEvents() {
    App.mainWindow.webContents.on('dom-ready', () => {
      this.transport = new MainTransport({
        ipcMain,
        browserWindow: App.mainWindow,
      });
    });
  }
}

// Retrieve app version
ipcMain.handle('get-app-version', (event) => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});
