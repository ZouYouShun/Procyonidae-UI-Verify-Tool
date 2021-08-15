import { BrowserWindow, clipboard, nativeImage, Rectangle } from 'electron';
import path, { join } from 'path';

import { getScreenshot } from './getScreenshot';
import { screenIpcKeys } from './screenIpcKeys';

type WindowOptions = {
  url: string;
  route: string;
};

export class ScreenshotWindow {
  // Screenshot Window Object
  captureWindow: Electron.BrowserWindow | null = null;

  get parentWindow() {
    return this.captureWindow?.getParentWindow();
  }

  private options!: WindowOptions;

  private mainDestroy = false;

  init(parentWindow: BrowserWindow, options: WindowOptions) {
    this.options = options;
    this.mainDestroy = false;
    this.initWindow(parentWindow);

    parentWindow.on('closed', () => {
      this.mainDestroy = true;
      /**
       * TODO: link to below
       *
       * {@link ScreenshotWindow.initWindow}
       */
      this.captureWindow?.close();
      this.captureWindow = null;
    });
  }

  private initWindow(parentWindow: BrowserWindow) {
    this.captureWindow = this.createWindow(parentWindow);

    // * children will trigger before parentWindow close
    this.captureWindow.once('closed', () => {
      console.log('captureWindow close');
      // TODO: should know is that close come from parent window close, if so not init again, current use above close manually
      if (this.mainDestroy) return;

      this.initWindow(parentWindow);
    });
  }

  /**
   * Start screenshot
   */
  async startCapture() {
    if (!this.captureWindow) return;

    // TODO: should calculate the original image size with screen, the original pixel
    const { captureSource, bounds } = getScreenshot();

    this.captureWindow.setPosition(bounds.x, bounds.y);
    this.captureWindow.setSize(bounds.width, bounds.height);

    const img = await captureSource;
    const imgURL = img.thumbnail.toDataURL();

    this.captureWindow.webContents.send(screenIpcKeys.onReady, imgURL);

    setTimeout(() => this.captureWindow?.show(), 100);

    return captureSource;
  }

  async getScreenshotImage() {
    // const img = await this.captureSource;
    // const imgURL = img.thumbnail.toDataURL();
    // this.captureWindow.webContents.send('screen:openScreenshot', imgURL);
    // return imgURL;
  }

  /**
   * End screenshot
   */
  endCapture(imgURL?: string): void {
    if (!this.captureWindow) return;

    const parentWindow = this.parentWindow;

    if (imgURL && parentWindow) {
      parentWindow.webContents.send(screenIpcKeys.onConfirmCapture, imgURL);
    }

    this.captureWindow.close();
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
      parent: parentWindow,
      show: false,
      frame: false,
      resizable: false,
      focusable: true,
      transparent: true,
      // Set to true, because mac full-screen windows do not have desktop scrolling effect
      simpleFullscreen: true,
      alwaysOnTop: true,
      enableLargerThanScreen: true,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'preload.js'),
      },
    });

    captureWindow.loadURL(path.join(this.options.url, this.options.route));

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
