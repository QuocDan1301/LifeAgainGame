import { readLifeArchive, readLifeDiscovery, SPECIAL_CATALOG, TITLE_CATALOG,
  describeCriminalRecord } from '../core/life-archive.js';
import { careerPaths } from '../career/career-event.js';
import { achievements } from '../achievements/achievements-data.js';

const node = (tag, text) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  return element;
};
const names = ids => ids.map(id => SPECIAL_CATALOG.find(s => s[0] === id)?.[1] ?? id).join(', ');

export function initLifeArchive() {
  const dialog = document.getElementById('life-archive-dialog');
  document.getElementById('open-life-archive').addEventListener('click', () => {
    const entries = readLifeArchive();
    const discovery = readLifeDiscovery();
    const body = document.getElementById('life-archive-body');
    body.replaceChildren(node('p', 'Sổ giữ 50 cuộc đời gần nhất trên thiết bị này. Dấu khám phá được giữ qua mọi đời, kể cả những đời đã rời sổ. Không gửi lên máy chủ.'));
    body.append(node('h3', 'Đã khám phá'));
    const list = node('ul');
    list.append(node('li', `Chuỗi đặc biệt: ${discovery.seen.length}/${SPECIAL_CATALOG.length} đã gặp; ${discovery.completed.length}/${SPECIAL_CATALOG.length} đã đi tới cuối.`),
      node('li', `Danh hiệu: ${discovery.titles.length}/${TITLE_CATALOG.length}.`),
      node('li', `Ngành đã đạt bậc 3: ${discovery.rank3.map(id => careerPaths.find(path => path[0] === id)?.[2] ?? id).join(', ') || 'Chưa có'}.`));
    body.append(list);
    const checklist = node('details');
    checklist.append(node('summary', 'Xem dấu ấn đã khám phá'));
    const checks = node('ul');
    for (const [id, label] of SPECIAL_CATALOG) checks.append(node('li',
      `${discovery.completed.includes(id) ? '✓ Đã hoàn thành' : discovery.seen.includes(id) ? '◐ Đã gặp' : '○ Chưa gặp'} · ${label}`));
    for (const title of TITLE_CATALOG) checks.append(node('li', `${discovery.titles.includes(title.id) ? '✓' : '○'} ${title.label}`));
    checklist.append(checks); body.append(checklist, node('h3', 'Đời sau thử…'));
    const hints = node('ul');
    discovery.hints.forEach(hint => hints.append(node('li', hint)));
    body.append(hints, node('h3', `Các cuộc đời đã sống (${entries.length})`));
    if (!entries.length) body.append(node('p', 'Chưa có cuộc đời nào được ghi sổ. Hành trình kết thúc sẽ để lại một trang ở đây.'));
    for (const entry of [...entries].reverse()) {
      const details = node('details');
      details.className = 'life-archive-entry';
      details.append(node('summary', `${entry.name} · ${entry.age} tuổi · ${entry.titles.main.label}`));
      details.append(node('p', `${entry.gender === 'female' ? 'Nữ' : 'Nam'} · ${entry.province || 'Chưa rõ quê quán'}`),
        node('p', entry.cause), node('p', `Nghề: ${entry.career?.job || entry.career?.field || 'Chưa có nghề'} · Bậc ${entry.career?.level ?? 0}`),
        node('p', `${entry.marriage} · ${entry.children} người con`),
        node('p', `Tiền án: ${describeCriminalRecord(entry)}`),
        node('p', `Danh hiệu: ${[entry.titles.main, ...(entry.titles.secondary ?? [])].map(t => t.label).join(' · ')}`),
        node('p', `Chuỗi đã gặp: ${names(entry.specialSeen ?? []) || 'Chưa có'}`),
        node('p', `Chuỗi hoàn thành: ${names(entry.specialCompleted ?? []) || 'Chưa có'}`),
        node('p', `Thành tựu mở trong đời: ${(entry.achievements ?? []).map(id => achievements.find(a => a.id === id)?.title ?? id).join(', ') || 'Chưa có'}`));
      body.append(details);
    }
    dialog.showModal(); dialog.scrollTop = 0;
  });
  document.getElementById('close-life-archive').addEventListener('click', () => dialog.close());
}
