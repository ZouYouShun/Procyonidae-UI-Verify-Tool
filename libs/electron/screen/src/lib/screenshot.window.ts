import {
  getWindowRouteUrl,
  WindowOptions,
} from '@procyonidae/electron/shared/utils';
import { BrowserWindow, clipboard, nativeImage, Rectangle } from 'electron';
import max from 'lodash/max';
import min from 'lodash/min';
import path, { join } from 'path';

import { getScreenshot } from './getScreenshot';
import { screenIpcKeys } from './screenIpcKeys';

export class ScreenshotWindow {
  captureWindow: Electron.BrowserWindow | null = null;

  get parentWindow() {
    return this.captureWindow?.getParentWindow();
  }

  private options!: WindowOptions;

  private initRouteUrl: string = '';
  private mainDestroy = false;

  init(parentWindow: BrowserWindow, options: WindowOptions) {
    this.options = options;
    this.initRouteUrl = getWindowRouteUrl(options);
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
    const { captureSources } = getScreenshot();

    const sources = await captureSources;

    const x = min(sources.map((o) => o.x)) || 0;
    const y = min(sources.map((o) => o.y)) || 0;
    const width = max(sources.map((o) => o.x - x + o.width)) || 0;
    const height = max(sources.map((o) => o.y + -y + o.height)) || 0;

    this.captureWindow.setPosition(x, y);
    this.captureWindow.setSize(width, height);

    this.captureWindow.webContents.send(screenIpcKeys.onReady, sources);

    setTimeout(() => this.captureWindow?.show(), 100);
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

    captureWindow.loadURL(this.initRouteUrl);

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
