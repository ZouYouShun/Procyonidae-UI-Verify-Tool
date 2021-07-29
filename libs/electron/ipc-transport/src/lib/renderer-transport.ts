import {
  MainTransportType,
  RendererTransportType,
} from './data-transport.interface';
import { ElectronTransport } from './source';

export class RendererTransport
  extends ElectronTransport.Renderer<RendererTransportType>
  implements MainTransportType
{
  async getAppVersion() {
    const response = await this.emit('version');
    return response;
  }

  async sayHello() {
    const response = await this.emit('hello', { num: 42 });
    return response;
  }

  async takeScreenshot() {
    return this.emit('takeScreenShot');
  }
}

export type RendererTransportInstance = InstanceType<typeof RendererTransport>;
