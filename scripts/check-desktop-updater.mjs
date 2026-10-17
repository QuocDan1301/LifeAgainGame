import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { compareVersions, releaseUpdate, downloadUpdate, replacementScript, createDesktopUpdater, EXE_NAME } from '../desktop/updater.mjs';

await fs.mkdir('.tmp', { recursive: true });
const directory = await fs.mkdtemp(path.resolve('.tmp', "lifeagain-update-test-đồ [1] '"));
const bytes = Buffer.from('MZ verified test fixture');
const sha256 = createHash('sha256').update(bytes).digest('hex');
const prefix = 'https://github.com/QuocDan1301/LifeAgainGame/releases/download/windows-v1.0.2/';
const release = { tag_name: 'windows-v1.0.2', assets: [
  { name: EXE_NAME, browser_download_url: prefix + EXE_NAME, size: bytes.length },
  { name: EXE_NAME + '.sha256', browser_download_url: prefix + EXE_NAME + '.sha256' },
] };
const update = releaseUpdate(release, '1.0.1');
assert.equal(update.version, '1.0.2');
assert.equal(compareVersions('1.10.0', '1.9.9'), 1);
assert.equal(compareVersions('2.0.0', '1.99.99'), 1);
assert.equal(releaseUpdate(release, '1.0.2'), null);
assert.equal(releaseUpdate(release, '2.0.0'), null, 'Never downgrade');
assert.equal(releaseUpdate({ ...release, draft: true }, '1.0.1'), null);
assert.equal(releaseUpdate({ ...release, prerelease: true }, '1.0.1'), null);
assert.equal(releaseUpdate({ ...release, tag_name: 'web-v1.0.2' }, '1.0.1'), null);
assert.throws(() => compareVersions('invalid', '1.0.0'));
assert.throws(() => releaseUpdate({ ...release, assets: [] }, '1.0.1'));
assert.throws(() => releaseUpdate({ ...release, assets: [
  { ...release.assets[0], browser_download_url: 'https://example.com/evil.exe' }, release.assets[1]
] }, '1.0.1'), /hợp lệ/);
const fetcher = async url => new Response(url.endsWith('.sha256') ? sha256 + '  ' + EXE_NAME + '\n' : bytes);
let ready = await downloadUpdate(update, directory, fetcher);
assert.deepEqual(await fs.readFile(ready.file), bytes);
const resumed = await downloadUpdate(update, directory, async url => {
  assert.ok(url.endsWith('.sha256'), 'Reuse verified file instead of downloading EXE again');
  return fetcher(url);
});
assert.equal(resumed.file, ready.file);
await fs.unlink(ready.file);
for (const bad of [Buffer.from('MZ corrupted'), Buffer.from('XX verified test fixture')]) {
  await assert.rejects(downloadUpdate(update, directory, async url =>
    url.endsWith('.sha256') ? fetcher(url) : new Response(bad)), /SHA-256/);
  assert.deepEqual(await fs.readdir(directory), [], 'Delete incomplete/corrupt downloads');
}
await assert.rejects(downloadUpdate(update, directory, async () => new Response('unavailable', { status: 503 })));
await assert.rejects(downloadUpdate(update, directory, async () => new Response('invalid checksum')));
await assert.rejects(downloadUpdate(update, directory, async url => {
  if (url.endsWith('.sha256')) return fetcher(url);
  return new Response(new ReadableStream({ start(controller) { controller.error(new Error('lost network')); } }));
}), /lost network/);
assert.deepEqual(await fs.readdir(directory), []);

if (process.platform === 'win32') {
  // Execute replacement against dummy files, mocking only the actual EXE launch.
  const target = path.join(directory, 'Life Again.exe');
  const staged = path.join(directory, 'new.exe');
  const log = path.join(directory, 'error.txt');
  const marker = path.join(directory, 'launched.txt');
  const quote = value => "'" + value.replaceAll("'", "''") + "'";
  for (const mode of ['success', 'tampered', 'launch-failure']) {
    await fs.writeFile(target, 'old working executable');
    await fs.writeFile(staged, mode === 'tampered' ? 'tampered file' : bytes);
    await fs.unlink(marker).catch(() => {});
    const mock = mode === 'launch-failure' ? "throw 'simulated launch failure'" :
      `[IO.File]::WriteAllText(${quote(marker)}, [IO.File]::ReadAllText($FilePath))`;
    const script = `function Start-Process { param($FilePath, $WorkingDirectory, $ErrorAction) ${mock} }\n` +
      replacementScript({ target, file: staged, sha256, pid: 2147483000, log });
    const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand',
      Buffer.from(script, 'utf16le').toString('base64')], { encoding: 'utf8', windowsHide: true, timeout: 30000 });
    assert.equal(result.status, 0, result.stderr);
    if (mode === 'success') {
      assert.deepEqual(await fs.readFile(target), bytes);
      assert.deepEqual(await fs.readFile(marker), bytes, 'Launch the installed file');
      await assert.rejects(fs.stat(staged + '.previous'), { code: 'ENOENT' });
    } else {
      assert.equal(await fs.readFile(target, 'utf8'), 'old working executable', 'Keep/restore old EXE after failure');
      assert.ok((await fs.readFile(log, 'utf8')).trim());
      await assert.rejects(fs.stat(marker), { code: 'ENOENT' });
    }
  }

  // Native updater UI must wait for explicit restart approval and a successful helper spawn.
  const app = new EventEmitter();
  Object.assign(app, { isPackaged: true, getVersion: () => '1.0.1', getPath: () => directory,
    quit: () => { app.quits = (app.quits ?? 0) + 1; } });
  const messages = [];
  let answer = 1;
  let launches = 0;
  const updater = createDesktopUpdater({ app, executable: target, getWindow: () => ({}),
    dialog: { showMessageBox: async (_window, options) => { messages.push(options); return { response: answer }; } },
    net: { fetch: async url => url.includes('api.github.com') ? Response.json(release) : fetcher(url) },
    launch: (_exe, args, options) => {
      launches++;
      assert.equal(options.windowsHide, true);
      assert.ok(args.includes('-EncodedCommand'));
      const child = new EventEmitter();
      child.unref = () => {};
      process.nextTick(() => child.emit('spawn'));
      return child;
    }
  });
  await updater.check(true);
  assert.equal(app.quits ?? 0, 0, 'Postpone does not quit');
  assert.equal(launches, 0);
  answer = 0;
  await updater.check(true);
  assert.equal(launches, 1);
  assert.equal(app.quits, 1);
  assert.ok(messages[0].detail.includes('giữ nguyên'));
  const offline = createDesktopUpdater({ app, executable: target, getWindow: () => ({}),
    dialog: { showMessageBox: async (_window, options) => { messages.push(options); return { response: 0 }; } },
    net: { fetch: async () => { throw new Error('offline'); } } });
  await offline.check(true);
  assert.equal(app.quits, 1, 'Offline check never closes the game');
  assert.ok(messages.at(-1).message.includes('vẫn có thể chơi'));
  const failedHelper = createDesktopUpdater({ app, executable: target, getWindow: () => ({}),
    dialog: { showMessageBox: async () => ({ response: 0 }) },
    net: { fetch: async url => url.includes('api.github.com') ? Response.json(release) : fetcher(url) },
    launch: () => {
      const child = new EventEmitter();
      process.nextTick(() => child.emit('error', new Error('helper unavailable')));
      return child;
    } });
  await failedHelper.check(true);
  assert.equal(app.quits, 1, 'Failed helper spawn never closes the game');
}
console.log('PASS updater: version selection, trusted release URLs, integrity, partial downloads, cached download, portable replacement, rollback, restart consent.');
