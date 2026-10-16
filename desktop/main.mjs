import { app, BrowserWindow, dialog, Menu, net, protocol, session, shell } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { GAME_ORIGIN, GAME_URL, HOME_URL, TRANSFER_PATHS, localFile, externalUrl } from './runtime.mjs';

app.setName('Life Again');
// A stable profile and origin preserve saves when the portable EXE moves or updates.
app.setPath('userData', app.commandLine.getSwitchValue('user-data-dir') || path.join(app.getPath('appData'), 'LifeAgain'));
protocol.registerSchemesAsPrivileged([{ scheme: 'lifeagain', privileges: {
  standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true
} }]);

let window;
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => {
    if (window?.isMinimized()) window.restore();
    window?.show();
    window?.focus();
  });
  app.whenReady().then(async () => {
    const root = path.join(app.getAppPath(), 'game');
    protocol.handle('lifeagain', async request => {
      const url = new URL(request.url);
      if (url.host !== 'game.lifeagain' || url.username || url.password) return new Response('', { status: 403 });
      if (TRANSFER_PATHS.has(url.pathname)) {
        if (request.method !== 'POST') return new Response('', { status: 405 });
        // Only the two explicit transfer actions contact the official game server.
        try {
          const body = await request.text();
          if (Buffer.byteLength(body) > 4 * 1024 * 1024) return new Response('', { status: 413 });
          return await net.fetch(new URL(url.pathname, HOME_URL).href, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
            redirect: 'error', signal: AbortSignal.timeout(60000)
          });
        } catch { return Response.json({ error: 'Chưa kết nối được máy chủ. Bạn có thể chuyển bằng tệp sao lưu.' }, { status: 503 }); }
      }
      if (!['GET', 'HEAD'].includes(request.method)) return new Response('', { status: 405 });
      const file = localFile(root, request.url);
      if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) return new Response('', { status: 404 });
      return net.fetch(pathToFileURL(file).href);
    });
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      if (!details.url.startsWith(GAME_ORIGIN + '/')) return callback({});
      callback({ responseHeaders: { ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-src 'none'"]
      } });
    });
    session.defaultSession.on('will-download', (_event, item) => {
      item.setSaveDialogOptions({ title: 'Lưu bản sao cuộc đời', defaultPath: path.join(app.getPath('downloads'), path.basename(item.getFilename())) });
    });
    window = new BrowserWindow({
      title: 'Life Again', width: 1280, height: 900, minWidth: 800, minHeight: 600,
      show: false, backgroundColor: '#fff8dc', icon: path.join(app.getAppPath(), 'icon.png'),
      webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true }
    });
    const openExternal = address => {
      const allowed = externalUrl(address);
      if (allowed) void shell.openExternal(allowed);
    };
    window.webContents.setWindowOpenHandler(({ url }) => { openExternal(url); return { action: 'deny' }; });
    window.webContents.on('will-navigate', (event, url) => {
      if (!url.startsWith(GAME_ORIGIN + '/')) { event.preventDefault(); openExternal(url); }
    });
    window.webContents.on('will-attach-webview', event => event.preventDefault());
    window.once('ready-to-show', () => window.show());
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { label: 'Life Again', submenu: [
        { label: 'Tải phiên bản mới', click: () => openExternal(HOME_URL + 'gioi-thieu#cai-dat') },
        { type: 'separator' }, { role: 'quit', label: 'Thoát' }
      ] },
      { label: 'Hiển thị', submenu: [{ role: 'togglefullscreen', label: 'Toàn màn hình' },
        { role: 'resetZoom', label: 'Kích thước mặc định' }, { role: 'zoomIn', label: 'Phóng to' }, { role: 'zoomOut', label: 'Thu nhỏ' }] }
    ]));
    await window.loadURL(GAME_URL);
  }).catch(error => {
    dialog.showErrorBox('Chưa mở được Life Again', 'Hãy tải lại bản Windows đầy đủ.\n' + error.message);
    app.quit();
  });
}
app.on('window-all-closed', () => app.quit());
