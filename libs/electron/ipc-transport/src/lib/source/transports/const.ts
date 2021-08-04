import { TransportOptions } from '../interface';

export const defaultChannel = '$$Electron_Transport$$';
export interface ElectronTransportOptions extends Partial<TransportOptions> {
  /**
   * Specify a Electron channel name.
   */
  channel?: string;
}
