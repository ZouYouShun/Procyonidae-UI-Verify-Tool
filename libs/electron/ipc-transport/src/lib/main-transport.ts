import { ScreenshotWindow } from '@procyonidae/electron/screen';

import { RendererTransport } from './renderer-transport';
import { ElectronTransport, listen } from './source';

export class MainTransport extends ElectronTransport.Main<
  InstanceType<typeof RendererTransport>
> {
  @listen
  async version(): Promise<{ version: string }> {
    return { version: '1.0.0' };
  }

  @listen
  async takeScreenShot() {
    const screenshotWindow = ScreenshotWindow.getInstance();
    const img = await screenshotWindow.startCapture();

    return img.thumbnail.toDataURL();
  }

  @listen
  async getScreenshotImage() {
    const screenshotWindow = ScreenshotWindow.getInstance();

    return screenshotWindow.captureSource?.thumbnail.toDataURL();
  }
}
