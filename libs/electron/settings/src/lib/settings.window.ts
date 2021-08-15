import { BrowserWindow, Rectangle } from 'electron';
import path, { join } from 'path';

type WindowOptions = {
  url: string;
  route: string;
};

export class SettingsWindow {
  settingsWindow: Electron.BrowserWindow | null = null;

  private parentWindow!: BrowserWindow;

  private options!: WindowOptions;

  init(parentWindow: BrowserWindow, options: WindowOptions) {
    this.options = options;
    this.parentWindow = parentWindow;

    parentWindow.on('closed', () => {
      this.settingsWindow = null;
    });
  }

  open() {
    if (this.settingsWindow) {
      this.settingsWindow?.show();
    } else {
      this.settingsWindow = this.createWindow(this.parentWindow);

      this.settingsWindow.once('ready-to-show', () => {
        this.settingsWindow?.show();
      });

      this.settingsWindow.on('close', (e) => {
        this.settingsWindow = null;
      });
    }
  }

  /**
   * Initialize window
   */
  private createWindow(
    parentWindow: BrowserWindow,
    rect?: Rectangle,
  ): BrowserWindow {
    const captureWindow = new BrowserWindow({
      title: 'Settings',
      ...rect,
      parent: parentWindow,
      show: false,
      resizable: true,
      focusable: true,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'preload.js'),
      },
    });

    captureWindow.loadURL(path.join(this.options.url, this.options.route));

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
