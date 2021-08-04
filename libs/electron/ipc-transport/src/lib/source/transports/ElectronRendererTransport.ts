import { IpcRenderer } from 'electron';

import { ListenerOptions } from '../interface';
import { Transport } from '../transport';
import { defaultChannel, ElectronTransportOptions } from './const';

export interface ElectronRendererTransportOptions
  extends ElectronTransportOptions {
  /**
   * Communicate asynchronously from a renderer process to the main process.
   */
  ipcRenderer: IpcRenderer;
}

export abstract class ElectronRendererTransport<
  T = any,
  P = any,
> extends Transport<T, P> {
  constructor({
    ipcRenderer,
    channel = defaultChannel,
    listener = (callback) => {
      const handler = (_: Electron.IpcRendererEvent, data: ListenerOptions) => {
        callback(data);
      };
      ipcRenderer.on(channel, handler);

      return () => {
        ipcRenderer.off(channel, handler);
      };
    },
    sender = (message) => ipcRenderer.send(channel, message),
    ...options
  }: ElectronRendererTransportOptions) {
    super({
      ...options,
      listener,
      sender,
    });
  }
}
