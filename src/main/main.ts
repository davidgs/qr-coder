/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('open-dialog', (event: Event, key: string) => {
  console.log('Main open: ', key);
  // eslint-disable-next-line promise/catch-or-return
  return dialog.showOpenDialog(mainWindow, {
    title: 'Open config',
    defaultPath: path.join(
      process.env.HOME || process.env.USERPROFILE,
      'config.json'
    ),
    filters: [
      {
        name: 'JSON',
        extensions: ['json'],
      },
    ],
  });
});

ipcMain.handle('save-config', (event: Event, key: string) => {
  console.log('Main save: ', key);
  // eslint-disable-next-line promise/catch-or-return
  dialog
    .showSaveDialog(mainWindow, {
      title: 'Save config',
      defaultPath: path.join(
        process.env.HOME || process.env.USERPROFILE,
        'config.json'
      ),
      filters: [
        {
          name: 'JSON',
          extensions: ['json'],
        },
      ],
    })
    .then((result) => {
      if (result.canceled) {
        return 'Save Cancelled';
      }
      const { filePath } = result;
      console.log('Save to: ', filePath);
      try {
        fs.writeFileSync(
          filePath,
          JSON.stringify(JSON.parse(key), null, 2),
          'utf-8'
        );
        return 'Saved';
      } catch (e) {
        console.log('Failed to save the file !');
        return 'Failed to save the file !';
      }
    });
});

ipcMain.handle('read-file', (event: Event, key: string) => {
  console.log('Main read: ', key);
  return fs.readFileSync(key, 'utf-8');
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  const options = {
    applicationName: 'QR Code Builder',
    applicationVersion: 'v0.6.0',
    copyright: '© 2023',
    version: 'b1025',
    credits: 'Credits:\n\t• David G. Simmons\n\t• Electron React Boilerplate',
    authors: ['David G. Simmons'],
    website: 'https://github.com/davidgs/qr-coder',
    iconPath: getAssetPath('icon.png'),
  };
  app.setAboutPanelOptions(options);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
