import { BrowserWindow, clipboard, nativeImage, Rectangle } from 'electron';
import { join } from 'path';

import { getScreenshot } from './get-screenshot';

export class ScreenshotWindow {
  // Screenshot Window Object
  captureWindow!: Electron.BrowserWindow;

  init(parentWindow: BrowserWindow) {
    this.captureWindow = this.createWindow(parentWindow);

    parentWindow.on('closed', this.endCapture);

    // re-init that window for quick open
    this.captureWindow.on('closed', () => this.init(parentWindow));
  }

  /**
   * Start screenshot
   */
  startCapture() {
    const { captureSource, bounds } = getScreenshot();
    this.captureWindow.loadURL(`http://localhost:4200/screen/screenshot`);

    if (this.captureWindow) {
      this.captureWindow.setPosition(bounds.x, bounds.y);
      this.captureWindow.setSize(bounds.width, bounds.height);
      this.captureWindow.show();
    }

    return captureSource;
  }

  /**
   * End screenshot
   */
  endCapture(): void {
    if (!this.captureWindow) return;
    this.captureWindow.setSimpleFullScreen(false);
    this.captureWindow.close();
    // * for GC
    // (this.captureWindow as any) = null;
  }

  /**
   * Initialize window
   */
  private createWindow(
    parentWindow: BrowserWindow,
    rect?: Rectangle,
  ): BrowserWindow {
    const captureWindow = new BrowserWindow({
      title: 'screenshots',
      ...rect,
      useContentSize: true,
      // modal: true,
      parent: parentWindow,
      show: false,
      autoHideMenuBar: true,
      minimizable: true,
      //
      closable: true,

      transparent: true,
      resizable: false,
      movable: false,
      focusable: true,
      // is true, the screenshot is displayed as a black screen
      // So set it to true after the screenshot image is generated.
      fullscreen: false,
      // Set to true, because mac full-screen windows do not have desktop scrolling effect
      simpleFullscreen: true,
      titleBarStyle: 'hidden',
      alwaysOnTop: true,
      enableLargerThanScreen: true,
      skipTaskbar: true,
      maximizable: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'preload.js'),
      },
    });

    captureWindow.webContents.openDevTools();

    return captureWindow;
  }

  private copyImgToKeyboard(dataURL: string): void {
    clipboard.writeImage(nativeImage.createFromDataURL(dataURL));
  }

  private static instance?: ScreenshotWindow;

  static getInstance(): ScreenshotWindow {
    if (!ScreenshotWindow.instance) {
      ScreenshotWindow.instance = new ScreenshotWindow();
    }
    return ScreenshotWindow.instance;
  }
}
