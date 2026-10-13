import { achievements } from '../achievements/achievements-data.js';
import { shopCatalog } from '../leisure/shop.js';

export const SCORE_VERSION = 1;
const achievementIds = new Set(achievements.map(item => item.id));
const prices = new Map(shopCatalog.map(item => [item.id, item.price]));
const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const bounded = (value, max) => Math.max(0, Math.min(max, finite(value)));
export function seasonId(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit' }).formatToParts(date);
  return `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}`;
}
export function observeRanking(state, now = new Date()) {
  const p = state.player;
  p.ranking ??= { id: crypto.randomUUID(), startedAt: now.toISOString(), startedAge: p.age,
    happiness: {}, workYears: [], relationshipYears: [] };
  const r = p.ranking;
  if (r.finished) return r;
  if (!Number.isInteger(p.age) || p.age < 0 || p.age > 105) return r;
  r.happiness[p.age] = bounded(p.happiness, 100);
  if (p.age >= 18 && p.age < 62 && (p.employmentStatus === 'employed' || (p.sideJobs ?? []).some(job => job.startedAtAge < p.age) ||
    (p.streetJobs ?? []).some(job => job.startedAtAge < p.age && (p.purchases ?? []).some(item => item.id ===
      (job.id === 'noodle-seller' ? 'noodle-cart' : job.id === 'motorbike-taxi' ? 'motorbike' : null))))) {
    if (!r.workYears.includes(p.age)) r.workYears.push(p.age);
  }
  if (p.partner && !r.relationshipYears.includes(p.age)) r.relationshipYears.push(p.age);
  return r;
}
export function rankingSnapshot(state) {
  const p = state.player;
  const r = observeRanking(state);
  return { age: p.age, finished: p.isAlive === false, name: String(p.name ?? '').slice(0, 40),
    path: String(p.careerPath?.field ?? 'Chưa chọn hướng').slice(0, 60),
    startedAge: r.startedAge, happiness: { ...r.happiness }, workYears: [...r.workYears], relationshipYears: [...r.relationshipYears],
    achievements: [...new Set([...(p.lifeAchievementIds ?? []), ...Object.keys(p.achievementFlags ?? {}).filter(id => p.achievementFlags[id] === true)])].filter(id => achievementIds.has(id)),
    money: finite(p.money), assets: [...(p.purchases ?? []), ...(p.livestock ?? [])].map(item => item.id),
    debts: [...(p.homeLoans ?? [])].map(loan => bounded(loan.outstanding, 1e15)),
    vocationalCompleted: Boolean(p.casualLife && new Set(r.workYears).size >= 2),
    educated: Boolean(p.careerPath?.school && p.age >= 22), serviceCompleted: Boolean(p.casualLife && p.gender === 'male' && p.age >= 20 && !p.casualService),
    recovered: (p.keepsakes ?? []).length > 0 || (p.memories ?? []).length > 0 || p.lifePath === 'reformed' };
}
export function calculateLifeScore(snapshot) {
  if (!Number.isInteger(snapshot.age) || snapshot.age < 0 || snapshot.age > 105 || snapshot.finished !== true) throw new Error('Cuộc đời chưa kết thúc hoặc dữ liệu tuổi không hợp lệ.');
  const age = snapshot.age;
  const values = Array.from({ length: age + 1 }, (_, i) => snapshot.happiness?.[i]);
  const complete = snapshot.startedAge === 0 && values.every(value => Number.isFinite(value) && value >= 0 && value <= 100);
  const samples = values.filter(Number.isFinite).map(value => bounded(value, 100));
  const average = samples.length ? samples.reduce((sum, value) => sum + value, 0) / samples.length : 0;
  const uniqueAchievements = [...new Set(snapshot.achievements ?? [])].filter(id => achievementIds.has(id));
  const achievementScore = Math.min(300, uniqueAchievements.reduce((sum, id) => sum + (id.startsWith('story-') ? 50 : id.startsWith('career-') ? 30 : 10), 0));
  const netWorth = Math.max(0, finite(snapshot.money) + (snapshot.assets ?? []).reduce((sum, id) => sum + (prices.get(id) ?? 0), 0)
    - (snapshot.debts ?? []).reduce((sum, amount) => sum + bounded(amount, 1e15), 0));
  const wealth = [1e8, 1e9, 1e10, 1e11, 1e12].reduce((points, threshold, index) => netWorth >= threshold ? (index + 1) * 30 : points, 0);
  const years = (items, from) => [...new Set(items ?? [])].filter(year => Number.isInteger(year) && year >= from && year <= age).length;
  const milestones = [
    snapshot.educated === true || snapshot.serviceCompleted === true || snapshot.vocationalCompleted === true,
    years(snapshot.workYears, 18) >= 10,
    snapshot.recovered === true || uniqueAchievements.some(id => id.startsWith('story-')),
    years(snapshot.relationshipYears, 18) >= 5,
    age >= 62,
  ];
  const breakdown = { achievements: achievementScore, happiness: Math.round(average * 2), longevity: Math.min(200, age * 2), wealth, milestones: milestones.filter(Boolean).length * 30 };
  return { version: SCORE_VERSION, total: Object.values(breakdown).reduce((sum, points) => sum + points, 0),
    breakdown, averageHappiness: Math.round(average * 10) / 10, netWorth, eligible: complete };
}
export const rankTier = score => score >= 4500 ? 'Huyền Thoại' : score >= 3500 ? 'Kim Cương' : score >= 2500 ? 'Bạch Kim' : score >= 1500 ? 'Vàng' : score >= 500 ? 'Bạc' : 'Đồng';
export function buildLeaderboard(accounts, runs, scope = seasonId()) {
  const entries = accounts.map(account => {
    const owned = runs.filter(run => run.accountId === account.id && run.score.eligible && (scope === 'all' || run.season === scope));
    const seasons = [...new Set(owned.map(run => run.season))];
    const selected = seasons.flatMap(season => owned.filter(run => run.season === season).sort((a, b) => b.score.total - a.score.total).slice(0, 5));
    const score = selected.reduce((sum, run) => sum + run.score.total, 0);
    const best = Math.max(0, ...owned.map(run => run.score.total));
    return { id: account.id, nickname: account.nickname, avatar: account.avatar, score, best, runs: owned.length, counted: selected.length, tier: rankTier(score) };
  }).filter(entry => entry.runs).sort((a, b) => b.score - a.score || b.best - a.best || a.nickname.localeCompare(b.nickname, 'vi'));
  let rank = 0;
  return entries.map((entry, index) => {
    if (!index || entry.score !== entries[index - 1].score || entry.best !== entries[index - 1].best) rank = index + 1;
    return { ...entry, rank };
  });
}
