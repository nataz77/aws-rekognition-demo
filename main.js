const electron = require('electron');
const path = require('path');
const url = require('url');
const pkg = require('./package.json');
require("dotenv").config();

const {
    app,
    BrowserWindow,
    ipcMain: ipc,
    Menu,
    protocol: electronProtocol
} = electron;

app.setAppUserModelId(pkg.name)
let mainWindow;

const development = process.env.NODE_ENV === 'development';

function prepareURL(pathSegments, moreKeys) {
    return url.format({
        pathname: path.join.apply(null, pathSegments),
        protocol: 'file:',
        slashes: true
    });
}

function getMainWindow() {
    return mainWindow;
}

function showWindow() {
    if (!mainWindow) {
        return;
    }
    if (mainWindow.isVisible()) {
        mainWindow.focus();
    } else {
        mainWindow.show();
    }
}


const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 610;
const MIN_WIDTH = 640;
const MIN_HEIGHT = 360;
const BOUNDS_BUFFER = 100;

function createWindow() {
    const { screen } = electron;
    const windowOptions = Object.assign(
        {
            show: true,
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            minWidth: MIN_WIDTH,
            minHeight: MIN_HEIGHT,
            autoHideMenuBar: false,
            webPreferences: {
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                nativeWindowOpen: true,
                preload: path.join(__dirname, 'preload.js'),
                enableRemoteModule: true
            },
            icon: path.join(__dirname, 'assets', 'icon_256.png'),
            frame: false,
            title: "Face recognition"
        }
    );
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(prepareURL([__dirname, "index.html"]))
    if (development) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('close', async e => {
        console.log(e)
        mainWindow.readyForShutdown = true;
        app.quit();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    ipc.on('show-window', () => {
        showWindow();
    });

    mainWindow.on('unresponsive', function () { })
    process.on('uncaughtException', function () { })
}

function setupMenu(options) {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

let ready = false;

app.on("ready", async () => {
    ready = true;
    createWindow();
    setupMenu();
})

app.on('activate', () => {
    if (!ready) {
        return;
    }
    if (mainWindow) {
        mainWindow.show();
    } else {
        createWindow();
    }
});

app.on('web-contents-created', (createEvent, contents) => {
    contents.on('will-attach-webview', attachEvent => {
        attachEvent.preventDefault();
    });
    contents.on('new-window', newEvent => {
        newEvent.preventDefault();
    });
});

//events
ipc.on('draw-attention', () => {
    if (process.platform === 'darwin') {
        app.dock.bounce();
    } else if (process.platform === 'win32') {
        mainWindow.flashFrame(true);
    } else if (process.platform === 'linux') {
        mainWindow.flashFrame(true);
    }
});

ipc.on('restart', () => {
    app.relaunch();
    app.quit();
});