import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { bundleDesktopFonts } from './desktop-fonts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'desktop', 'app');
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
execFileSync(process.execPath, ['scripts/build.mjs'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, GAME_HOSTS: 'game.lifeagain' }
});
if (path.relative(root, destination) !== path.join('desktop', 'app')) throw new Error('Invalid desktop staging path');
fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });
fs.cpSync(path.join(root, 'dist'), path.join(destination, 'game'), { recursive: true });
for (const file of ['main.mjs', 'runtime.mjs']) fs.copyFileSync(path.join(root, 'desktop', file), path.join(destination, file));
fs.copyFileSync(path.join(root, 'img/Icon/android-icon-512x512.png'), path.join(destination, 'icon.png'));
fs.writeFileSync(path.join(destination, 'package.json'), JSON.stringify({
  name: 'life-again-desktop', productName: 'Life Again', version: metadata.version,
  description: 'Game mô phỏng cuộc đời Life Again cho Windows', author: 'QuocDan',
  license: 'UNLICENSED', type: 'module', main: 'main.mjs'
}, null, 2));
const index = path.join(destination, 'game/index.html');
let html = fs.readFileSync(index, 'utf8').replace(' data-offline', '');
html = html.replace('id="install-link"', 'id="install-link" hidden');
fs.writeFileSync(index, html);
await bundleDesktopFonts(root, path.join(destination, 'game'));
console.log('Bản Windows đã sẵn sàng đóng gói: mở thẳng game, lưu trên máy, không cần trình duyệt.');
