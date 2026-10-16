import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';

 
 
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const YEAR = new Date().getFullYear();
const BANNER = `/*! Life Again © ${YEAR} QuocDan. Mọi quyền được bảo lưu. Không được sao chép, chỉnh sửa, phân phối hoặc đăng lại khi chưa có sự cho phép bằng văn bản. */`;
 
const ASSET_DIRS = ['img', 'music', 'audio', 'fonts', 'sounds', 'assets'];
const LOCKED_ENTRIES = ['boot.js', 'main.js'];
const PAGES = ['index.html', 'gioi-thieu.html'];

 
const hosts = [process.env.RENDER_EXTERNAL_HOSTNAME, ...(process.env.GAME_HOSTS ?? '').split(',')]
  .map(host => host?.trim().toLowerCase()).filter(Boolean);
if (process.env.RENDER && !hosts.length) throw new Error('Thiếu RENDER_EXTERNAL_HOSTNAME hoặc GAME_HOSTS: không build để tránh khóa nhầm trang chính thức.');
const homeUrl = process.env.GAME_HOME_URL ?? process.env.RENDER_EXTERNAL_URL ?? '';

 
function hashHost(host) {
  let hash = 2166136261;
  for (const ch of host) hash = Math.imul(hash ^ ch.codePointAt(0), 16777619) >>> 0;
  return hash;
}

const hostGuard = `((allowed, home) => {
  const host = location.hostname.toLowerCase();
  if (/^(localhost|127(\\.\\d+){3}|10(\\.\\d+){3}|192\\.168(\\.\\d+){2}|\\[::1\\])$/.test(host)) return;
  let hash = 2166136261;
  for (const ch of host) hash = Math.imul(hash ^ ch.codePointAt(0), 16777619) >>> 0;
  if (allowed.includes(hash)) return;
  const box = document.createElement("main");
  box.style.cssText = "max-width:420px;margin:20vh auto;padding:24px;font:18px/1.5 sans-serif;text-align:center";
  box.textContent = "Đây là bản sao trái phép của Life Again.";
  if (home) {
    const link = document.createElement("a");
    link.href = home;
    link.textContent = "Chơi bản chính thức";
    box.append(document.createElement("br"), link);
  }
  document.body.replaceChildren(box);
  throw new Error("Life Again: unauthorized host");
})(${JSON.stringify(hosts.map(hashHost))}, ${JSON.stringify(homeUrl)});
`;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function output(file) {
  const target = path.join(DIST, path.relative(ROOT, file));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  return target;
}

async function buildJs(file) {
  const relative = path.relative(path.join(ROOT, 'js'), file).replaceAll('\\', '/');
  const source = fs.readFileSync(file, 'utf8');
  const guarded = LOCKED_ENTRIES.includes(relative) ? hostGuard + source : source;
  const { code } = await transform(guarded, { loader: 'js', format: 'esm', minify: true, charset: 'utf8', legalComments: 'none', banner: BANNER, sourcefile: relative });
  fs.writeFileSync(output(file), code);
}

async function buildCss(file) {
  const { code } = await transform(fs.readFileSync(file, 'utf8'), { loader: 'css', minify: true, legalComments: 'none', banner: BANNER });
  fs.writeFileSync(output(file), code);
}

 
async function buildHtml(file) {
   
  let html = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace('<html lang="vi">', `<html lang="vi" data-offline${path.basename(file) === 'index.html' ? ' data-installed-only' : ''}>`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  for (const [whole, body] of scripts) {
    const { code } = await transform(body, { loader: 'js', minify: true, legalComments: 'none' });
    html = html.replace(whole, () => `<script>${code.trim()}</script>`);
  }
  fs.writeFileSync(output(file), html);
}

 
 
function shouldPrecache(relative) {
  if (relative.startsWith('js/img/') || relative.startsWith('img/site/')) return false;
  if (/\.(md|txt)$/.test(relative)) return false;
  if (relative.endsWith('.png')) return relative.startsWith('img/Icon/') || relative.startsWith('img/teams/');
  return true;
}

function fontStylesheets() {
  const urls = new Set();
  for (const page of PAGES) {
    for (const [, url] of fs.readFileSync(path.join(ROOT, page), 'utf8').matchAll(/href="(https:\/\/(?:fonts\.googleapis\.com\/css2?\?[^"]+|cdnjs\.cloudflare\.com\/[^"]+\.css))"/g)) {
      urls.add(url.replaceAll('&amp;', '&'));
    }
  }
  return [...urls];
}

async function buildServiceWorker() {
  const files = [...walk(DIST)].map(file => path.relative(DIST, file).replaceAll('\\', '/')).filter(shouldPrecache).sort();
  const hash = createHash('sha256');
  for (const file of files) hash.update(file).update(fs.readFileSync(path.join(DIST, file)));
  const template = fs.readFileSync(path.join(ROOT, 'scripts', 'sw-template.js'), 'utf8');
  hash.update(template);
   
  const urls = [...new Set(['./', ...files.map(file => './' + file)])];
  const source = template
    .replace('__VERSION__', JSON.stringify(hash.digest('hex').slice(0, 12)))
    .replace('__PRECACHE__', JSON.stringify(urls))
    .replace('__FONT_STYLESHEETS__', JSON.stringify(fontStylesheets()));
  const { code } = await transform(source, { loader: 'js', minify: true, charset: 'utf8', legalComments: 'none', banner: BANNER });
  fs.writeFileSync(path.join(DIST, 'sw.js'), code);
  const bytes = files.reduce((sum, file) => sum + fs.statSync(path.join(DIST, file)).size, 0);
  return { count: files.length, megabytes: (bytes / 1024 / 1024).toFixed(1) };
}

const started = Date.now();
fs.rmSync(DIST, { recursive: true, force: true });
const jobs = PAGES.map(page => buildHtml(path.join(ROOT, page)));
fs.copyFileSync(path.join(ROOT, 'manifest.json'), output(path.join(ROOT, 'manifest.json')));
for (const file of walk(path.join(ROOT, 'js'))) {
  if (file.endsWith('.js')) jobs.push(buildJs(file));
   
  else if (!file.endsWith('.json')) fs.copyFileSync(file, output(file));
}
for (const dir of ['css', 'site']) {
  for (const file of walk(path.join(ROOT, dir))) {
    if (file.endsWith('.css')) jobs.push(buildCss(file));
    else if (file.endsWith('.js')) jobs.push(buildJs(file));
    else fs.copyFileSync(file, output(file));
  }
}
for (const dir of ASSET_DIRS) {
  if (fs.existsSync(path.join(ROOT, dir))) fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true });
}
await Promise.all(jobs);
const offline = await buildServiceWorker();

console.log(`Build xong dist/ trong ${((Date.now() - started) / 1000).toFixed(1)} giây.`);
console.log(`Chơi offline: tải sẵn ${offline.count} tệp (${offline.megabytes} MB).`);
console.log(hosts.length
  ? `Khóa tên miền: ${hosts.join(', ')} (và localhost, mạng LAN).`
  : 'Khóa tên miền: chỉ localhost và mạng LAN (chưa đặt GAME_HOSTS).');