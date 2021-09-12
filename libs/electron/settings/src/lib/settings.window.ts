import {
  getWindowRouteUrl,
  WindowOptions,
} from '@procyonidae/electron/shared/utils';
import { BrowserWindow, Rectangle } from 'electron';
import path from 'path';

export class SettingsWindow {
  window: Electron.BrowserWindow | null = null;

  private options!: WindowOptions;

  private initRouteUrl: string = '';

  init(parentWindow: BrowserWindow, options: WindowOptions) {
    this.options = options;

    this.initRouteUrl = getWindowRouteUrl(options);
  }

  open() {
    if (this.window) {
      this.window?.show();
    } else {
      this.window = this.createWindow();

      this.window.once('ready-to-show', () => {
        this.window?.show();
      });

      this.window.on('close', (e) => {
        this.window = null;
      });
    }
  }

  /**
   * Initialize window
   */
  private createWindow(rect?: Rectangle): BrowserWindow {
    const captureWindow = new BrowserWindow({
      title: 'Settings',
      ...rect,
      show: false,
      resizable: true,
      focusable: true,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    captureWindow.loadURL(this.initRouteUrl);

    return captureWindow;
  }

  private static instance?: SettingsWindow;

  static getInstance(): SettingsWindow {
    if (!SettingsWindow.instance) {
      SettingsWindow.instance = new SettingsWindow();
    }
    return SettingsWindow.instance;
  }
}
