import { bindScreenIpcListeners } from '@procyonidae/electron/screen';
import { bindSettingsIpcListeners } from '@procyonidae/electron/settings';
import { bindSnippetIpcListeners } from '@procyonidae/electron/snippet';
import { bindSpeechToTextIpcListeners } from '@procyonidae/electron/speech-to-text';
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

const mainApp = App.getInstance();

ipcMain.handle('root:hide', (event) => {
  mainApp.hideWindow();
  return true;
});

// Handle App termination
ipcMain.on('quit', (event, code) => app.exit(code));

bindScreenIpcListeners();
bindSnippetIpcListeners((height) => {
  mainApp.setHeight(height);
});

bindSettingsIpcListeners();
bindSpeechToTextIpcListeners();
