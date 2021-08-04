import { ListenerOptions } from '../interface';
import { Transport } from '../transport';
import { defaultChannel, ElectronTransportOptions } from './const';
import { BrowserWindow, IpcMain } from 'electron';

export interface ElectronMainTransportOptions extends ElectronTransportOptions {
  /**
   * Specify a browser windows created by the Electron main process.
   */
  browserWindow: BrowserWindow;
  /**
   * Communicate asynchronously from the main process to renderer processes.
   */
  ipcMain: IpcMain;
}

export abstract class ElectronMainTransport<T = any, P = any> extends Transport<
  T, P
> {
  constructor({
    ipcMain, browserWindow, channel = defaultChannel, listener = (callback) => {
      const handler = (_: Electron.IpcMainEvent, data: ListenerOptions) => {
        callback(data);
      };

      ipcMain.on(channel, handler);

      return () => {
        ipcMain.off(channel, handler);
      };
    }, sender = (message) => browserWindow.webContents.send(channel, message), ...options
  }: ElectronMainTransportOptions) {
    super({
      ...options,
      listener,
      sender,
    });
  }
}
