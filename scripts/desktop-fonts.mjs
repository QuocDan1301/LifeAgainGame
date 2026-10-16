import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Ship the existing web fonts/icons with Windows, including the first offline launch.
export async function bundleDesktopFonts(root, game) {
  const cache = path.join(root, '.tmp/desktop-fonts');
  const destination = path.join(game, 'desktop-fonts');
  fs.mkdirSync(cache, { recursive: true });
  fs.mkdirSync(destination, { recursive: true });
  const get = async address => {
    const id = createHash('sha256').update(address).digest('hex');
    const filename = id + (path.extname(new URL(address).pathname) || '.css');
    const cached = path.join(cache, filename);
    if (!fs.existsSync(cached)) {
      const response = await fetch(address, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error('Font download HTTP ' + response.status + ': ' + address);
      fs.writeFileSync(cached, Buffer.from(await response.arrayBuffer()));
    }
    return { filename, data: fs.readFileSync(cached) };
  };
  const index = path.join(game, 'index.html');
  let html = fs.readFileSync(index, 'utf8');
  const styles = [...new Set([...html.matchAll(/href="(https:\/\/(?:fonts.googleapis.com|cdnjs.cloudflare.com)\/[^"<>]+)"/g)]
    .map(match => match[1]).filter(address => address.includes('/css') || address.endsWith('.css')))];
  for (const address of styles) {
    const sheet = await get(address);
    let css = sheet.data.toString('utf8');
    const sources = [...new Set([...css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)].map(match => match[1]))];
    for (const source of sources) {
      if (source.startsWith('data:')) continue;
      const remote = new URL(source, address);
      if (remote.protocol !== 'https:' || !['fonts.gstatic.com', 'cdnjs.cloudflare.com'].includes(remote.hostname)) throw new Error('Unexpected font host: ' + remote.hostname);
      const font = await get(remote.href);
      fs.writeFileSync(path.join(destination, font.filename), font.data);
      css = css.replaceAll(source, './' + font.filename);
    }
    fs.writeFileSync(path.join(destination, sheet.filename), css);
    html = html.replaceAll(address, './desktop-fonts/' + sheet.filename);
  }
  html = html.replace(/<link[^>]*rel="preconnect"[^>]*>/g, '');
  fs.writeFileSync(index, html);
  const notices = [
    ['Font-Awesome-LICENSE.txt', 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/7.3.1/LICENSE.txt'],
    ...['francoisone', 'oswald', 'patrickhand', 'sriracha'].map(font =>
      [font + '-OFL.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/' + font + '/OFL.txt'])
  ];
  for (const [name, address] of notices) {
    const license = await get(address);
    fs.writeFileSync(path.join(destination, name), license.data);
  }
}
