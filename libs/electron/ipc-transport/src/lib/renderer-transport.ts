import { ipcRenderer } from 'electron';

import { ElectronTransport } from './source';

import type { MainTransport } from './main-transport';
export class RendererTransport extends ElectronTransport.Renderer<
  InstanceType<typeof MainTransport>
> {
  async getAppVersion() {
    const response = await this.emit('version');
    return response;
  }

  async takeScreenshot() {
    return this.emit('takeScreenShot');
  }

  async getScreenshotImage() {
    return this.emit('getScreenshotImage');
  }
}

export type RendererTransportInstance = InstanceType<typeof RendererTransport>;

export const getIpcBridge = () => {
  const transport = new RendererTransport({
    ipcRenderer,
  });

  return {
    platform: process.platform,
    getAppVersion: () => transport.getAppVersion(),
    takeScreenshot: () => transport.takeScreenshot(),
    getScreenshotImage: () => transport.getScreenshotImage(),
  };
};
