import { ScreenshotWindow } from '@procyonidae/electron/screen';
import { BrowserWindow, globalShortcut, Menu, screen, shell } from 'electron';
import { join } from 'path';
import { format } from 'url';

import { environment } from '../environments/environment';
import { rendererAppName, rendererAppPort } from './constants';

const DEFAULT_HEIGHT = 60;

export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;

  static screenshotWindow: ScreenshotWindow;

  static BrowserWindow: typeof BrowserWindow;

  static willQuitApp = false;

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment: boolean =
      parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      App.application.quit();
    }
  }

  private static onRedirect(event: any, url: string) {
    if (url !== App.mainWindow.webContents.getURL()) {
      // this is a normal external redirect, open it in a new browser window
      event.preventDefault();
      shell.openExternal(url);
    }
  }

  private static onReady() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    App.initMainWindow();
    App.loadMainWindow();

    ScreenshotWindow.getInstance().init(App.mainWindow);
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.mainWindow === null) {
      App.onReady();
    } else {
      App.mainWindow.show();
    }
  }

  private static setWindowInCurrentDesktop() {
    App.mainWindow.setVisibleOnAllWorkspaces(true); // put the window on all screens
    App.mainWindow.focus(); // focus the window up front on the active screen
    App.mainWindow.setVisibleOnAllWorkspaces(false); // disable all screen behavior

    const { x, y } = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    App.mainWindow.setPosition(
      currentDisplay.workArea.x,
      currentDisplay.workArea.y,
    );
    App.mainWindow.center();
  }

  private static initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);

    // Create the browser window.
    App.mainWindow = new BrowserWindow({
      width: width / 2,
      height: DEFAULT_HEIGHT,

      show: false,
      alwaysOnTop: true,
      frame: false,
      // transparent: true,
      resizable: false,
      webPreferences: {
        // * That is important, should alway use contextIsolation for security and not pollution window environment
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'preload.js'),
      },
    });

    App.mainWindow.setMenu(null);
    // TODO: only open in prop make use debug easily
    // App.mainWindow.center();

    // if main window is ready to show, close the splash window and show the main window
    App.mainWindow.once('ready-to-show', () => {
      App.setWindowInCurrentDesktop();

      App.mainWindow.show();
    });

    // handle all external redirects in a new browser window
    // App.mainWindow.webContents.on('will-navigate', App.onRedirect);
    // App.mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    //     App.onRedirect(event, url);
    // });

    App.mainWindow.on('close', (e) => {
      if (App.willQuitApp) {
        App.mainWindow = null;
      } else {
        e.preventDefault();
        // App.mainWindow.hide();
        // * use send action to make that cursor restore to previous position
        App.hideWindow();
      }
    });

    // App.mainWindow.on('blur', () => {
    //   App.hideWindow();
    // });
  }

  static hideWindow() {
    Menu.sendActionToFirstResponder('hide:');
  }

  private static loadMainWindow() {
    // load the index.html of the app.
    if (!App.application.isPackaged) {
      App.mainWindow.loadURL(`http://localhost:${rendererAppPort}`);
      // TODO: open devtool will cause that app can't auto close by nx-electron
      // App.mainWindow.webContents.openDevTools();
    } else {
      App.mainWindow.loadURL(
        format({
          pathname: join(__dirname, '..', rendererAppName, 'index.html'),
          protocol: 'file:',
          slashes: true,
        }),
      );
    }
  }

  private static bindShortcut() {
    globalShortcut.register('CommandOrControl+shift+X', () => {
      if (App.mainWindow) {
        App.mainWindow.show();
      }
    });
    globalShortcut.register('CommandOrControl+shift+v', () => {});
  }

  static setHeight(height: number) {
    const [width] = App.mainWindow.getSize();
    App.mainWindow.setSize(width, height);
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for

    App.BrowserWindow = browserWindow;
    App.application = app;

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', () => {
      App.onReady();

      App.bindShortcut();
    }); // App is ready to load data
    App.application.on('activate', App.onActivate); // App is activated
    App.application.on('before-quit', () => (App.willQuitApp = true));
  }
}
