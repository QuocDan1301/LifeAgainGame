import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const repository = 'QuocDan1301/LifeAgainGame';
const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
const tag = 'windows-v' + version;
const command = process.argv[2] ?? 'status';
if (!['status', 'prepare', 'publish'].includes(command)) throw new Error('Use status, prepare or publish');
const credentials = spawnSync('git', ['credential', 'fill'], {
  input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8',
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' }, windowsHide: true
});
const token = credentials.stdout?.split(/\r?\n/).find(line => line.startsWith('password='))?.slice(9);
if (credentials.status !== 0 || !token) throw new Error('Không có phiên GitHub trong Git Credential Manager để tạo bản phát hành.');
const headers = { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'LifeAgainPublisher' };
async function api(route, options = {}) {
  const response = await fetch('https://api.github.com/repos/' + repository + route, {
    headers: { ...headers, 'Content-Type': 'application/json' }, ...options, signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) throw new Error('GitHub API HTTP ' + response.status + ' at ' + route);
  return response.status === 204 ? null : response.json();
}
const repo = await api('');
const releases = await api('/releases?per_page=100');
let release = releases.find(item => item.tag_name === tag);
if (command === 'status') {
  console.log(JSON.stringify({ repository: repo.full_name, private: repo.private, push: repo.permissions?.push,
    release: release ? { id: release.id, tag: release.tag_name, draft: release.draft, assets: release.assets.map(asset => ({ name: asset.name, size: asset.size })) } : null }, null, 2));
  process.exit(0);
}
if (repo.private) throw new Error('Public downloads require a public release repository.');
if (!release && command === 'prepare') release = await api('/releases', {
  method: 'POST', body: JSON.stringify({ tag_name: tag, target_commitish: 'main', name: 'Life Again cho Windows ' + version, draft: true,
    body: 'Bản Windows 64-bit chạy trực tiếp. Tải LifeAgain-Windows-x64.exe và bấm đúp để chơi. Có thể chơi ngoại tuyến; bản lưu được giữ trên máy khi cập nhật file. Dùng Chuyển thiết bị để nhập bản lưu từ web.\n\nBản phát hành chưa được ký Authenticode. Tệp SHA-256 đi kèm để kiểm tra bản tải xuống.' })
});
if (!release) throw new Error('Prepare the release first.');
if (command === 'prepare') {
  for (const name of ['LifeAgain-Windows-x64.exe', 'LifeAgain-Windows-x64.exe.sha256']) {
    const file = path.resolve('output/windows-release', name);
    const size = fs.statSync(file).size;
    const hash = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const existing = release.assets.find(asset => asset.name === name);
    if (existing) {
      if (existing.size !== size || (existing.digest && existing.digest !== 'sha256:' + hash)) throw new Error('Existing asset differs: ' + name);
      console.log('Already uploaded: ' + name);
      continue;
    }
    if (!release.draft) throw new Error('Use a new version instead of altering a published release.');
    const upload = new URL(release.upload_url.split('{')[0]);
    if (upload.hostname !== 'uploads.github.com') throw new Error('Unexpected upload host');
    upload.searchParams.set('name', name);
    console.log('Uploading ' + name + ' (' + size + ' bytes)');
    const response = await fetch(upload, { method: 'POST', headers: { ...headers,
      'Content-Type': 'application/octet-stream', 'Content-Length': String(size) },
      body: fs.createReadStream(file), duplex: 'half', signal: AbortSignal.timeout(600000) });
    if (!response.ok) throw new Error('GitHub asset upload HTTP ' + response.status);
    const asset = await response.json();
    console.log('Uploaded ' + asset.name + ': ' + asset.size + ' bytes');
  }
} else if (release.draft) {
  const sha = process.argv[3];
  if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Publish requires the pushed source commit SHA.');
  release = await api('/releases/' + release.id, { method: 'PATCH', body: JSON.stringify({ target_commitish: sha, draft: false, make_latest: 'true' }) });
}
console.log(JSON.stringify({ release: release.html_url, draft: release.draft, tag }, null, 2));
