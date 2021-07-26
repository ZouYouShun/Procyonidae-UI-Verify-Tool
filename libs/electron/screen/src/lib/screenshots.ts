import {
  BrowserWindow,
  clipboard,
  ipcMain,
  nativeImage,
  Rectangle,
} from 'electron';
import Events from 'events';

import Event from './event';
import getBoundAndDisplay from './getBoundAndDisplay';
import { OkData } from './typings';

export class Screenshots extends Events {
  // Screenshot Window Object
  public $win: BrowserWindow | null = null;

  constructor() {
    super();
    this.listenIpc();
  }

  /**
   * Start screenshot
   */
  public startCapture(): void {
    if (this.$win && !this.$win.isDestroyed()) this.$win.close();
    const { bound, display } = getBoundAndDisplay();
    this.$win = this.createWindow(bound);
    ipcMain.once('SCREENSHOTS::DOM-READY', () => {
      if (!this.$win) return;
      this.$win.webContents.send('SCREENSHOTS::SEND-DISPLAY-DATA', display);
    });

    // Display the window after capturing the desktop
    // Avoid the screenshot window to be screenshot yourself.
    ipcMain.once('SCREENSHOTS::CAPTURED', () => {
      if (!this.$win) return;
      // There is a black screen in the linux screenshot, set it to false here to avoid this problem.
      this.$win.setFullScreen(true);
      this.$win.show();
      this.$win.focus();
    });
  }

  /**
   * End screenshot
   */
  public endCapture(): void {
    if (!this.$win) return;
    this.$win.setSimpleFullScreen(false);
    this.$win.close();
    this.$win = null;
  }

  /**
   * Initialize window
   */
  private createWindow({ x, y, width, height }: Rectangle): BrowserWindow {
    const $win = new BrowserWindow({
      title: 'screenshots',
      x,
      y,
      width,
      height,
      useContentSize: true,
      frame: false,
      show: false,
      autoHideMenuBar: true,
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
      minimizable: false,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    });

    $win.loadURL(`http://localhost:4200/screen/screenshot`);

    return $win;
  }

  private listenIpc(): void {
    /**
     * OK
     */
    ipcMain.on('SCREENSHOTS::OK', (e, data: OkData) => {
      const event = new Event();
      this.emit('ok', event, data);
      if (!event.defaultPrevented) {
        clipboard.writeImage(nativeImage.createFromDataURL(data.dataURL));
        this.endCapture();
      }
    });

    /**
     * CANCEL
     */
    ipcMain.on('SCREENSHOTS::CANCEL', () => {
      const event = new Event();
      this.emit('cancel', event);
      if (!event.defaultPrevented) {
        this.endCapture();
      }
    });
  }
}
