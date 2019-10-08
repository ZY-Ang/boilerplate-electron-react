const {app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

// Will be true if currently running on a Mac
const isMac = process.platform === 'darwin';

// This is our application window
let appWindow;

/**
 * Creates a window for the app
 */
const createWindow = () => {
	const startUrl = isDev
		? (process.env.ELECTRON_START_URL || 'http://localhost:3000')
		: url.format({
			pathname: path.join(__dirname, '../build/index.html'),
			protocol: 'file:',
			slashes: true
		});
	appWindow = new BrowserWindow({
		width: 900,
		height: 600,
		webPreferences: {
			devTools: isDev,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	appWindow.loadURL(startUrl);
	if (isDev) {
		appWindow.webContents.openDevTools();
	}
	appWindow.on('closed', () => (appWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (!isMac) {
		app.quit();
	}
});

app.on('activate', () => {
	if (appWindow === null) {
		createWindow();
	}
});
