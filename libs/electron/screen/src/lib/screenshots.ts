import { BrowserWindow, clipboard, nativeImage, Rectangle } from 'electron';
import { join } from 'path';

import { getScreenshot } from './get-screenshot';

export class ScreenshotWindow {
  // Screenshot Window Object
  public static captureWindow: BrowserWindow;

  init() {
    ScreenshotWindow.captureWindow = ScreenshotWindow.createWindow();
  }

  /**
   * Start screenshot
   */
  public static startCapture() {
    const { image, bounds } = getScreenshot();
    ScreenshotWindow.captureWindow.show();
    ScreenshotWindow.captureWindow.setPosition(bounds.x, bounds.y);
    ScreenshotWindow.captureWindow.setSize(bounds.width, bounds.height);

    return image;
  }

  /**
   * End screenshot
   */
  public static endCapture(): void {
    if (!this.captureWindow) return;
    this.captureWindow.setSimpleFullScreen(false);
    this.captureWindow.close();
    // * for GC
    (this.captureWindow as any) = null;
  }

  /**
   * Initialize window
   */
  private static createWindow(rect?: Rectangle): BrowserWindow {
    const captureWindow = new BrowserWindow({
      title: 'screenshots',
      ...rect,
      useContentSize: true,
      frame: false,
      show: false,
      autoHideMenuBar: true,
      minimizable: true,
      closable: false,
      transparent: true,
      resizable: false,
      movable: false,
      focusable: true,
      // is true, the screenshot is displayed as a black screen
      // So set it to true after the screenshot image is generated.
      fullscreen: false,
      // Set to true, because mac full-screen windows do not have desktop scrolling effect
      simpleFullscreen: true,
      backgroundColor: '#00000000',
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
    captureWindow.webContents.openDevTools();

    return captureWindow;
  }

  private copyImgToKeyboard(dataURL: string): void {
    clipboard.writeImage(nativeImage.createFromDataURL(dataURL));
  }
}
