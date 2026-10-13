import { collectibles, gameOf } from './game-center-data.js';

export const ALBUM_MILESTONES = [
  { id: 'starter', count: 3, tickets: 8, title: 'Người sưu tầm mới' },
  { id: 'collector', count: 6, tickets: 20, title: 'Tủ quà đa sắc' },
  { id: 'enthusiast', count: 10, tickets: 45, title: 'Sưu tầm có gu' },
  { id: 'complete', count: collectibles.length, tickets: 100, title: 'Trọn bộ Game Center' },
];
export function annualChallenges(age) {
  const variation = ((Math.trunc(age) % 3) + 3) % 3;
  const pool = [
    { id: 'basket', type: 'basketball', target: 10 + variation * 4, tickets: 6, title: `Đạt ${10 + variation * 4} điểm Bóng rổ trong một lượt` },
    { id: 'variety', type: 'variety', target: 3, tickets: 8, title: 'Hoàn thành lượt chơi ở 3 trò khác nhau' },
    { id: 'whack', type: 'whack', target: 15 + variation * 5, tickets: 6, title: `Đạt ${15 + variation * 5} điểm Đập chuột trong một lượt` },
    { id: 'tickets', type: 'tickets', target: 15, tickets: 5, title: 'Kiếm 15 vé từ Bóng rổ và Đập chuột' },
    { id: 'explorer', type: 'plays', target: 5, tickets: 5, title: 'Hoàn thành 5 lượt chơi bất kỳ' },
  ];
  const start = ((Math.trunc(age) % pool.length) + pool.length) % pool.length;
  return Array.from({ length: 3 }, (_, index) => pool[(start + index) % pool.length]);
}

export function progressOf(arcade, age) {
  arcade.progress ??= { records: {}, album: {}, milestones: [], settled: [], annual: null };
  const p = arcade.progress;
  p.records ??= {}; p.album ??= {}; p.milestones ??= []; p.settled ??= [];
  // Import owned gifts from old saves; gifts remain discovered after they are given away.
  for (const item of collectibles) if ((arcade.collection?.[item.id] ?? 0) > 0 || (arcade.plushes?.[item.id]?.count ?? 0) > 0) p.album[item.id] = true;
  if (p.annual?.age !== age) p.annual = { age, plays: 0, games: [], scores: {}, tickets: 0, claimed: [] };
  return p;
}
export function challengeProgress(task, annual) {
  const value = task.type === 'variety' ? annual.games.length : task.type === 'plays' ? annual.plays :
    task.type === 'tickets' ? annual.tickets : annual.scores[task.type] ?? 0;
  return Math.min(task.target, value);
}
export function recordArcadeResult(arcade, age, session, { tickets = 0, win = false, interrupted = false } = {}) {
  const game = gameOf(session.game);
  if (!game || interrupted) return null;
  const p = progressOf(arcade, age);
  if (p.settled.includes(session.id)) return null;
  p.settled = [...p.settled, session.id].slice(-100);
  const old = p.records[game.id] ?? { plays: 0, wins: 0, best: 0 };
  const score = Number.isFinite(session.score) ? Math.max(0, Math.floor(session.score)) : 0;
  const scored = Boolean(game.tiers);
  const newBest = scored && score > old.best;
  p.records[game.id] = { plays: old.plays + 1, wins: old.wins + Number(win), best: scored ? Math.max(old.best, score) : 0 };
  const annual = p.annual;
  if (session.age === age) {
    annual.plays++;
    annual.games = [...new Set([...annual.games, game.id])];
    if (scored) annual.scores[game.id] = Math.max(annual.scores[game.id] ?? 0, score);
    annual.tickets += Math.max(0, tickets);
  }
  return { newBest, best: p.records[game.id].best };
}
export function claimChallenge(arcade, age, id) {
  const annual = progressOf(arcade, age).annual;
  const task = annualChallenges(age).find(item => item.id === id);
  if (!task || annual.claimed.includes(id) || challengeProgress(task, annual) < task.target) return null;
  annual.claimed.push(id); arcade.tickets += task.tickets;
  return task;
}
export function albumCount(progress) { return collectibles.filter(item => progress.album[item.id]).length; }
export function claimAlbumMilestone(arcade, age, id) {
  const p = progressOf(arcade, age), milestone = ALBUM_MILESTONES.find(item => item.id === id);
  if (!milestone || p.milestones.includes(id) || albumCount(p) < milestone.count) return null;
  p.milestones.push(id); arcade.tickets += milestone.tickets;
  return milestone;
}
export const recordDescription = (game, record) => !record?.plays ? 'Chưa có lượt hoàn thành' : game.tiers
  ? `Kỷ lục ${record.best} điểm · ${record.plays} lượt`
  : `${record.wins}/${record.plays} lượt thành công`;
