const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// This line gets the code from the newly created file logger.js

app.on('ready', () => {
    createWindow();
    log.info('ready entrou');
    autoUpdater.checkForUpdatesAndNotify()
        .then(() => {})
        .catch((error) => {
            log.info(error);
    });
    log.info('ready entrou');
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
    log.info('update available entrou');
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    log.info('update downloaded entrou');
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});