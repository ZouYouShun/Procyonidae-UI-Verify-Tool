import { BrowserWindow, clipboard, nativeImage, Rectangle } from 'electron';
import { join } from 'path';

import { getScreenshot } from './getScreenshot';

export class ScreenshotWindow {
  // Screenshot Window Object
  captureWindow: Electron.BrowserWindow | null = null;

  private mainDestroy = false;

  init(parentWindow: BrowserWindow) {
    this.mainDestroy = false;
    this.initWindow(parentWindow);

    parentWindow.on('closed', () => {
      console.log('main close');
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

    this.captureWindow.webContents.send('screen:openScreenshot', imgURL);

    setTimeout(() => {
      // wait that resize complete
      this.captureWindow?.show();
    }, 100);

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
    captureWindow.loadURL(`http://localhost:4200/screen/screenshot`);

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
