import { BrowserWindow } from 'electron';

import { getScreenshot } from './get-screenshot';

export class ScreenshotWindow {
  // Screenshot Window Object

  init(parentWindow: BrowserWindow) {}

  /**
   * Start screenshot
   */
  startCapture() {
    const { captureSource, bounds } = getScreenshot();

    return captureSource;
  }

  /**
   * End screenshot
   */
  endCapture(): void {}

  private static instance?: ScreenshotWindow;

  static getInstance(): ScreenshotWindow {
    if (!ScreenshotWindow.instance) {
      ScreenshotWindow.instance = new ScreenshotWindow();
    }
    return ScreenshotWindow.instance;
  }
}
