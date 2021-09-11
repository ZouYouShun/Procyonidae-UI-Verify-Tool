import { ScreenshotWindow } from '@procyonidae/electron/screen';
import { SpeechToText } from '@procyonidae/electron/speech-to-text';
import { BrowserWindow, globalShortcut, Menu, screen, shell } from 'electron';
import { SettingsWindow } from 'libs/electron/settings/src/lib/settings.window';
import { join } from 'path';
import { format } from 'url';

import { environment } from '../environments/environment';
import { rendererAppName, rendererAppPort } from './constants';

const DEFAULT_HEIGHT = 60;

export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  mainWindow: Electron.BrowserWindow;
  application: Electron.App;

  BrowserWindow: typeof BrowserWindow;

  private willQuitApp = false;

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      this.application.quit();
    }
  }

  private onRedirect(event: any, url: string) {
    if (url !== this.mainWindow.webContents.getURL()) {
      // this is a normal external redirect, open it in a new browser window
      event.preventDefault();
      shell.openExternal(url);
    }
  }

  private onReady() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.

    const loadURL = this.getLoadURL();
    this.initMainWindow();
    this.mainWindow.loadURL(loadURL);

    ScreenshotWindow.getInstance().init(this.mainWindow, {
      url: loadURL,
      route: 'screen/screenshot',
    });
    SettingsWindow.getInstance().init(this.mainWindow, {
      url: loadURL,
      route: 'settings',
    });

    SpeechToText.getInstance().init();
  }

  private onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (this.mainWindow === null) {
      this.onReady();
    } else {
      this.showWindow();
    }
  }

  private setWindowInCurrentDesktop() {
    this.mainWindow.setVisibleOnAllWorkspaces(true); // put the window on all screens
    this.mainWindow.focus(); // focus the window up front on the active screen
    this.mainWindow.setVisibleOnAllWorkspaces(false); // disable all screen behavior

    const { x, y } = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    this.mainWindow.setPosition(
      currentDisplay.workArea.x,
      currentDisplay.workArea.y,
    );
    this.mainWindow.center();
  }

  private initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);

    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      width: width / 2,
      height: DEFAULT_HEIGHT,

      show: false,
      alwaysOnTop: true,
      frame: false,
      transparent: true,
      resizable: false,
      skipTaskbar: true,
      webPreferences: {
        // * That is important, should alway use contextIsolation for security and not pollution window environment
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'preload.js'),
      },
    });

    this.mainWindow.setMenu(null);
    // this.mainWindow.center();

    // if main window is ready to show, close the splash window and show the main window
    this.mainWindow.once('ready-to-show', () => {
      this.showWindow();
    });

    // handle all external redirects in a new browser window
    // this.mainWindow.webContents.on('will-navigate', this.onRedirect);
    // this.mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    //     this.onRedirect(event, url);
    // });

    this.mainWindow.on('close', (e) => {
      if (this.willQuitApp) {
        this.mainWindow = null;
      } else {
        e.preventDefault();
        // this.mainWindow.hide();
        // * use send action to make that cursor restore to previous position
        this.hideWindow();
      }
    });

    // this.mainWindow.on('blur', () => {
    //   const settingsWindow = SettingsWindow.getInstance();

    //   if (settingsWindow.window) {
    //     this.mainWindow.hide();
    //   } else {
    //     this.hideWindow();
    //   }
    // });
  }

  private getLoadURL() {
    // load the index.html of the this.
    if (!this.application.isPackaged) {
      return `http://localhost:${rendererAppPort}`;
      // TODO: open devtool will cause that app can't auto close by nx-electron
      // this.mainWindow.webContents.openDevTools();
    } else {
      return format({
        pathname: join(__dirname, '..', rendererAppName, 'index.html'),
        protocol: 'file:',
        slashes: true,
      });
    }
  }

  private bindShortcut() {
    globalShortcut.register('CommandOrControl+shift+X', () => {
      if (this.mainWindow) {
        this.mainWindow.isVisible() ? this.hideWindow() : this.showWindow();
      }
    });
    globalShortcut.register('CommandOrControl+shift+V', () => {});
    globalShortcut.register('Alt+CommandOrControl+A', () => {
      const screenshotWindow = ScreenshotWindow.getInstance();

      screenshotWindow.startCapture();
    });
  }

  isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment: boolean =
      parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  /**
   * use `Menu.sendActionToFirstResponder('hide:');`
   * will auto restore focus to previous window and cursor position
   */
  hideWindow() {
    if (process.platform === 'win32') {
      this.mainWindow.hide();
      return;
    }
    Menu.sendActionToFirstResponder('hide:');
  }

  showWindow() {
    this.setWindowInCurrentDesktop();
    this.mainWindow.show();
  }

  setHeight(height: number) {
    const [width] = this.mainWindow.getSize();
    this.mainWindow.setSize(width, Math.ceil(height));
  }

  main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for

    this.BrowserWindow = browserWindow;
    this.application = app;

    this.application.on('window-all-closed', this.onWindowAllClosed); // Quit when all windows are closed.
    this.application.on('ready', () => {
      this.onReady();

      this.bindShortcut();
    }); // App is ready to load data
    this.application.on('activate', () => this.onActivate()); // App is activated
    this.application.on('before-quit', () => (this.willQuitApp = true));
  }

  private static instance?: App;

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}
