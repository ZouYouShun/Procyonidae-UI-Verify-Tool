import { bindScreenIpcListeners } from '@procyonidae/electron/screen';
import { bindSnippetIpcListeners } from '@procyonidae/electron/snippet';
import { app, ipcMain, Menu } from 'electron';

import { environment } from '../../environments/environment';

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

ipcMain.handle('root:hide', (event) => {
  Menu.sendActionToFirstResponder('hide:');
  return true;
});

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});

bindScreenIpcListeners();
bindSnippetIpcListeners();
