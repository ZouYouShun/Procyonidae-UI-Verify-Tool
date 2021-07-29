import { ScreenshotWindow } from '@procyonidae/electron/screen';
import {
  MainTransportType,
  RendererTransportType,
} from './data-transport.interface';
import { ElectronTransport, listen } from './source';

export class MainTransport
  extends ElectronTransport.Main<MainTransportType>
  implements RendererTransportType
{
  @listen
  async version(): Promise<{ version: string }> {
    return { version: '1.0.0' };
  }

  @listen
  async hello(options: { num: number }) {
    return {
      text: `hello, ${options.num}`,
    };
  }

  @listen
  async takeScreenShot() {
    const img = await ScreenshotWindow.startCapture();

    return img.thumbnail.toDataURL();
  }
}
