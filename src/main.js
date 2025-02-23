import { app, BrowserWindow, Menu } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
