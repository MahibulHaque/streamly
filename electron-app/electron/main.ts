import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import log from 'electron-log/main';

// Optional, initialize the logger for any renderer process
log.initialize();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, 'public')
	: RENDERER_DIST;

let win: BrowserWindow | null;
let studioWin: BrowserWindow | null;
let floatingWebcamWin: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		width: 600,
		height: 600,
		minHeight: 600,
		minWidth: 300,
		frame: false,
		transparent: true,
		alwaysOnTop: true,
		focusable: true,
		hasShadow: false,

		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			devTools: true,
			preload: path.join(__dirname, 'preload.mjs'),
		},
	});

	studioWin = new BrowserWindow({
		width: 400,
		height: 250,
		minHeight: 70,
		maxHeight: 400,
		minWidth: 300,
		maxWidth: 400,
		frame: false,
		transparent: true,
		alwaysOnTop: true,
		focusable: false,
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			devTools: true,
			preload: path.join(__dirname, 'preload.mjs'),
		},
	});

	floatingWebcamWin = new BrowserWindow({
		width: 200,
		height: 200,
		minHeight: 200,
		maxHeight: 200,
		minWidth: 200,
		maxWidth: 200,
		frame: false,
		transparent: true,
		alwaysOnTop: true,
		focusable: false,
		hasShadow: false,
		titleBarStyle: 'hidden',
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			devTools: true,
			preload: path.join(__dirname, 'preload.mjs'),
		},
	});

	win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
	win.setAlwaysOnTop(true, 'screen-saver', 1);

	studioWin.setVisibleOnAllWorkspaces(true, {
		visibleOnFullScreen: true,
	});
	studioWin.setAlwaysOnTop(true, 'screen-saver', 1);

	floatingWebcamWin.setVisibleOnAllWorkspaces(true, {
		visibleOnFullScreen: true,
	});
	floatingWebcamWin.setAlwaysOnTop(true, 'screen-saver', 1);

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send(
			'main-process-message',
			new Date().toLocaleString(),
		);
	});

	studioWin.webContents.on('did-finish-load', () => {
		studioWin?.webContents.send(
			'main-process-message',
			new Date().toLocaleString(),
		);
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
		studioWin.loadURL(`${import.meta.env.VITE_APP_URL}/studio.html`);
		floatingWebcamWin.loadURL(`${import.meta.env.VITE_APP_URL}/webcam.html`);
	} else {
		win.loadFile(path.join(RENDERER_DIST, 'index.html'));
		studioWin.loadFile(path.join(RENDERER_DIST, 'studio.html'));
		floatingWebcamWin.loadFile(path.join(RENDERER_DIST, 'webcam.html'));
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
		studioWin = null;
		floatingWebcamWin = null;
	}
});

ipcMain.on('closeApp', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
		studioWin = null;
		floatingWebcamWin = null;
	}
});

ipcMain.handle('getSources', async () => {
	const data = await desktopCapturer.getSources({
		thumbnailSize: {
			height: 100,
			width: 150,
		},
		fetchWindowIcons: true,
		types: ['window', 'screen'],
	});
	return data;
});

ipcMain.on('media-sources', (event, payload) => {
	studioWin?.webContents.send('profile-received', payload);
});

ipcMain.on('resize-studio', (event, payload) => {
	if (payload.shrink) {
		studioWin?.setSize(400, 100);
	}
	if (!payload.shrink) {
		studioWin?.setSize(400, 250);
	}
});

ipcMain.on('hide-plugin', (event, payload) => {
	win?.webContents.send('hide-plugins', payload);
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
