import { ScreenshotWindow } from '@procyonidae/electron/screen';

import { RendererTransport } from './renderer-transport';
import { ElectronTransport, listen } from './source';

export class MainTransport extends ElectronTransport.Main<
  InstanceType<typeof RendererTransport>
> {
  photoDataURL = '';

  @listen
  async version(): Promise<{ version: string }> {
    return { version: '1.0.0' };
  }

  @listen
  async takeScreenShot() {
    const screenshotWindow = ScreenshotWindow.getInstance();
    const img = await screenshotWindow.startCapture();
    console.log('takeScreenShot');

    this.photoDataURL = img.thumbnail.toDataURL();

    return this.photoDataURL;
  }

  @listen
  async getScreenshotImage() {
    console.log('!!getScreenshotImage');
    return this.photoDataURL;
  }
}
