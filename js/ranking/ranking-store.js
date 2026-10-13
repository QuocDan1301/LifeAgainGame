import { calculateLifeScore, observeRanking, rankingSnapshot, seasonId } from './scoring.js';

const KEY = 'lifeAgainRankingHistory';
export function getRankingHistory() {
  try { const value = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
export function finishRanking(state) {
  const r = observeRanking(state);
  if (state.player.isAlive !== false) return null;
  const history = getRankingHistory();
  const existing = history.find(item => item.id === r.id);
  if (existing) return existing;
  const snapshot = rankingSnapshot(state);
  const record = { id: r.id, completedAt: new Date().toISOString(), season: seasonId(), snapshot, score: calculateLifeScore(snapshot),
    serverRunId: r.serverRunId ?? null, accountId: r.accountId ?? null };
  localStorage.setItem(KEY, JSON.stringify([...history, record]));
  r.finished = true;
  return record;
}
export function markRankingSubmitted(id) {
  const history = getRankingHistory();
  const record = history.find(item => item.id === id);
  if (record) { record.submitted = true; localStorage.setItem(KEY, JSON.stringify(history)); }
}
