// Bridges only the in-game update button to the main-process updater.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lifeAgainDesktop', {
  onUpdateReady(callback) {
    ipcRenderer.on('update-ready', (_event, version) => callback(String(version)));
    ipcRenderer.send('update-status');
  },
  installUpdate: () => ipcRenderer.invoke('install-update'),
});
