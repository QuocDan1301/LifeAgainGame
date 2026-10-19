import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

export const RELEASE_API = 'https://api.github.com/repos/QuocDan1301/LifeAgainGame/releases/latest';
export const EXE_NAME = 'LifeAgain-Windows-x64.exe';
const RELEASE_PREFIX = 'https://github.com/QuocDan1301/LifeAgainGame/releases/download/';
const MAX_BYTES = 1024 * 1024 * 1024;

export function compareVersions(left, right) {
  const parse = value => /^\d+\.\d+\.\d+$/.test(value) ? value.split('.').map(Number) : null;
  const a = parse(left), b = parse(right);
  if (!a || !b || [...a, ...b].some(n => !Number.isSafeInteger(n))) throw new Error('Phiên bản không hợp lệ.');
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  return 0;
}

export function releaseUpdate(release, currentVersion) {
  if (release.draft || release.prerelease || !/^windows-v\d+\.\d+\.\d+$/.test(release.tag_name ?? '')) return null;
  const version = release.tag_name.slice('windows-v'.length);
  if (compareVersions(version, currentVersion) <= 0) return null;
  const assets = release.assets ?? [];
  const exe = assets.find(asset => asset.name === EXE_NAME);
  const checksum = assets.find(asset => asset.name === EXE_NAME + '.sha256');
  const prefix = RELEASE_PREFIX + release.tag_name + '/';
  if (!exe || !checksum || exe.browser_download_url !== prefix + EXE_NAME ||
      checksum.browser_download_url !== prefix + EXE_NAME + '.sha256' ||
      !Number.isSafeInteger(exe.size) || exe.size < 2 || exe.size > MAX_BYTES) {
    throw new Error('Bản phát hành thiếu tệp Windows hoặc mã kiểm tra hợp lệ.');
  }
  return { version, url: exe.browser_download_url, checksumUrl: checksum.browser_download_url, size: exe.size };
}

async function responseFor(fetcher, url, timeout) {
  const response = await fetcher(url, { signal: AbortSignal.timeout(timeout), cache: 'no-store',
    headers: { 'User-Agent': 'LifeAgainUpdater', Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error('Chưa tải được bản cập nhật (HTTP ' + response.status + ').');
  return response;
}

export async function downloadUpdate(update, directory, fetcher) {
  const checksumResponse = await responseFor(fetcher, update.checksumUrl, 30000);
  const checksumText = await checksumResponse.text();
  const match = /^([a-f0-9]{64})\s+\*?LifeAgain-Windows-x64\.exe\s*$/i.exec(checksumText);
  if (!match) throw new Error('Mã kiểm tra bản cập nhật không hợp lệ.');
  const sha256 = match[1].toLowerCase();
  const cached = path.join(directory, '.lifeagain-update-' + update.version + '-' + sha256.slice(0, 12) + '.exe');
  try {
    if ((await fs.stat(cached)).size === update.size) {
      const cachedHash = createHash('sha256');
      for await (const chunk of createReadStream(cached)) cachedHash.update(chunk);
      if (cachedHash.digest('hex') === sha256) return { ...update, file: cached, sha256 };
    }
  } catch { /* No verified download to resume yet. */ }
  const file = path.join(directory, '.lifeagain-update-' + randomUUID() + '.exe');
  const response = await responseFor(fetcher, update.url, 10 * 60 * 1000);
  if (!response.body) throw new Error('Tệp cập nhật trống.');
  const hash = createHash('sha256');
  const handle = await fs.open(file, 'wx');
  let size = 0;
  let header = Buffer.alloc(0);
  try {
    for await (const chunk of response.body) {
      const bytes = Buffer.from(chunk);
      size += bytes.length;
      if (size > update.size || size > MAX_BYTES) throw new Error('Kích thước bản cập nhật không hợp lệ.');
      if (header.length < 2) header = Buffer.concat([header, bytes]).subarray(0, 2);
      hash.update(bytes);
      await handle.writeFile(bytes);
    }
    if (size !== update.size || header.toString('ascii') !== 'MZ' || hash.digest('hex') !== sha256) {
      throw new Error('Tệp cập nhật bị thiếu hoặc không khớp mã SHA-256.');
    }
    await handle.sync();
  } catch (error) {
    await handle.close();
    await fs.unlink(file).catch(() => {});
    throw error;
  }
  await handle.close();
  try { await fs.rename(file, cached); }
  catch (error) { await fs.unlink(file).catch(() => {}); throw error; }
  return { ...update, file: cached, sha256 };
}

// Quote literal PowerShell strings; no release text is used as executable code.
const psLiteral = value => "'" + String(value).replaceAll("'", "''") + "'";

// relaunch=false installs silently after the player closes the game; a failure is
// not logged because the verified download stays cached and is retried next time.
export function replacementScript({ target, file, sha256, pid, log, relaunch = true }) {
  if (!path.isAbsolute(target) || !path.isAbsolute(file) || path.dirname(target) !== path.dirname(file) ||
      target === file || !/^[a-f0-9]{64}$/.test(sha256) || !Number.isSafeInteger(pid) || pid < 1) {
    throw new Error('Đường dẫn thay bản cập nhật không hợp lệ.');
  }
  return `$ErrorActionPreference = 'Stop'
$target = ${psLiteral(target)}
$staged = ${psLiteral(file)}
$backup = ${psLiteral(file + '.previous')}
$logFile = ${log ? psLiteral(log) : '$null'}
$relaunch = ${relaunch ? '$true' : '$false'}
$moved = $false
$installed = $false
try {
  $running = Get-Process -Id ${pid} -ErrorAction SilentlyContinue
  if ($running) { Wait-Process -Id ${pid} -Timeout 180 -ErrorAction Stop }
  $hasher = [Security.Cryptography.SHA256]::Create()
  $stream = [IO.File]::OpenRead($staged)
  try { $actualHash = [BitConverter]::ToString($hasher.ComputeHash($stream)).Replace('-', '').ToLowerInvariant() }
  finally { $stream.Dispose(); $hasher.Dispose() }
  if ($actualHash -ne ${psLiteral(sha256)}) { throw 'SHA-256 mismatch' }
  for ($attempt = 0; $attempt -lt 60; $attempt++) {
    try { Move-Item -LiteralPath $target -Destination $backup -ErrorAction Stop; $moved = $true; break }
    catch { if ($attempt -eq 59) { throw }; Start-Sleep -Milliseconds 500 }
  }
  Move-Item -LiteralPath $staged -Destination $target -ErrorAction Stop
  $installed = $true
  if ($relaunch) { Start-Process -FilePath $target -WorkingDirectory ([IO.Path]::GetDirectoryName($target)) -ErrorAction Stop }
  Remove-Item -LiteralPath $backup -ErrorAction SilentlyContinue
  if ($logFile) { Remove-Item -LiteralPath $logFile -ErrorAction SilentlyContinue }
} catch {
  if ($moved -and (Test-Path -LiteralPath $backup)) {
    if ($installed) { Remove-Item -LiteralPath $target -ErrorAction SilentlyContinue }
    Move-Item -LiteralPath $backup -Destination $target -ErrorAction SilentlyContinue
  }
  if ($logFile) { $_.Exception.Message | Set-Content -LiteralPath $logFile -Encoding UTF8 }
}
`;
}

export function createDesktopUpdater({ app, dialog, net, getWindow, executable = process.env.PORTABLE_EXECUTABLE_FILE,
  launch = spawn, onReady = () => {} }) {
  let busy = false;
  let ready = null;
  let installing = false;
  const enabled = app.isPackaged && process.platform === 'win32' && executable && path.isAbsolute(executable);
  const log = path.join(app.getPath('userData'), 'update-error.txt');
  const message = options => dialog.showMessageBox(getWindow(), { title: 'Cập nhật Life Again', ...options });
  function launchHelper(relaunch) {
    const script = replacementScript({ ...ready, target: executable, pid: process.pid, log: relaunch ? log : null, relaunch });
    // The helper outlives Electron and waits for a normal shutdown before replacing the portable EXE.
    const powershell = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
    return launch(powershell, ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-EncodedCommand',
      Buffer.from(script, 'utf16le').toString('base64')], { detached: true, windowsHide: true, stdio: 'ignore' });
  }
  // Used by the in-game update button: the player already chose to update.
  async function restartAndInstall() {
    if (!ready || installing) return false;
    installing = true;
    try {
      const child = launchHelper(true);
      await new Promise((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject); });
      child.unref();
    } catch (error) {
      installing = false;
      throw error;
    }
    app.quit();
    return true;
  }
  async function install() {
    const { response } = await message({ type: 'info', message: 'Phiên bản ' + ready.version + ' đã sẵn sàng.',
      detail: 'Khởi động lại để cập nhật. Bản lưu cuộc đời được giữ nguyên.',
      buttons: ['Khởi động lại và cập nhật', 'Để sau'], defaultId: 1, cancelId: 1 });
    if (response !== 0) return;
    await restartAndInstall();
  }
  // A downloaded update the player never applied is installed when the game closes.
  function installOnQuit() {
    if (!ready || installing) return;
    installing = true;
    try {
      const child = launchHelper(false);
      child.once('error', () => {});
      child.unref?.();
    } catch { /* The verified download is retried on the next quit. */ }
  }
  async function check(manual = false) {
    if (busy) {
      if (manual) await message({ type: 'info', message: 'Game đang kiểm tra hoặc tải bản cập nhật. Bạn có thể tiếp tục chơi.' });
      return;
    }
    if (!enabled) {
      if (manual) await message({ type: 'info', message: 'Tự cập nhật chỉ dùng trong file EXE portable đã đóng gói.' });
      return;
    }
    busy = true;
    try {
      if (ready) { if (manual) await install(); return; }
      const response = await responseFor(net.fetch.bind(net), RELEASE_API, 30000);
      const update = releaseUpdate(await response.json(), app.getVersion());
      if (!update) {
        if (manual) await message({ type: 'info', message: 'Bạn đang dùng phiên bản Windows mới nhất (' + app.getVersion() + ').' });
        return;
      }
      ready = await downloadUpdate(update, path.dirname(executable), net.fetch.bind(net));
      onReady(ready.version);
      // Background checks only reveal the in-game update button; the menu check asks right away.
      if (manual) await install();
    } catch (error) {
      if (manual) await message({ type: 'warning', message: 'Chưa cập nhật được. Bạn vẫn có thể chơi bình thường.', detail: error.message });
      else console.warn('Life Again update: ' + error.message);
    } finally { busy = false; }
  }
  async function start() {
    if (!enabled) return;
    const failure = await fs.readFile(log, 'utf8').catch(() => null);
    if (failure) {
      await message({ type: 'warning', message: 'Lần cập nhật trước chưa hoàn tất. Bản game cũ đã được giữ lại.',
        detail: 'Hãy kiểm tra quyền ghi vào thư mục chứa EXE rồi chọn Kiểm tra cập nhật.\n' + failure });
      await fs.unlink(log).catch(() => {});
    }
    void check();
    const interval = setInterval(() => void check(), 60 * 60 * 1000);
    interval.unref();
    app.once('will-quit', () => {
      clearInterval(interval);
      installOnQuit();
    });
  }
  return { check, start, restartAndInstall, readyVersion: () => ready?.version ?? null };
}
