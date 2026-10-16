import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { build, Platform, Arch } from 'electron-builder';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'life-again-windows-'));
const config = JSON.parse(fs.readFileSync(path.join(root, 'desktop/builder.json'), 'utf8'));
config.directories = { app: path.join(root, 'desktop/app'), output: stage };
const artifacts = await build({ targets: Platform.WINDOWS.createTarget(['portable'], Arch.x64), config, publish: 'never' });
const destination = path.join(root, 'output/windows-release');
fs.mkdirSync(destination, { recursive: true });
for (const file of artifacts.filter(file => file.endsWith('.exe'))) {
  const name = path.basename(file);
  fs.copyFileSync(file, path.join(destination, name));
  const sha256 = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  fs.writeFileSync(path.join(destination, name + '.sha256'), sha256 + '  ' + name + '\n');
  console.log('Windows EXE: ' + path.join(destination, name));
}
fs.writeFileSync(path.join(destination, 'build-info.json'), JSON.stringify({
  unpackedExecutable: path.join(stage, 'win-unpacked/Life Again.exe'), artifacts: artifacts.map(file => path.basename(file))
}, null, 2));
