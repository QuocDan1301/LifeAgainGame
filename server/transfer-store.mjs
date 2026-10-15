import { randomInt } from 'node:crypto';

 
 
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const TRANSFER_TTL_MS = 10 * 60 * 1000;
export const MAX_TRANSFER_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_BYTES = 64 * 1024 * 1024;
const KEY_PATTERN = /^lifeAgain[A-Za-z]+$/;

export function normalizeTransferCode(value) {
  const code = typeof value === 'string' ? value.toUpperCase().replace(/[\s-]/g, '') : '';
  return code.length === 6 && [...code].every(ch => ALPHABET.includes(ch)) ? code : null;
}

 
export function isTransferPackage(value) {
  if (!value || value.app !== 'life-again' || value.v !== 1) return false;
  const { data } = value;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const entries = Object.entries(data);
  return entries.length > 0 && entries.every(([key, item]) => KEY_PATTERN.test(key) && typeof item === 'string');
}

export function createTransferStore({ now = Date.now } = {}) {
  const entries = new Map();
  let total = 0;
  function remove(code) {
    total -= entries.get(code).body.length;
    entries.delete(code);
  }
  function sweep() {
    const time = now();
    for (const [code, entry] of entries) if (entry.expires <= time) remove(code);
  }
  return {
    put(body) {
      sweep();
      if (total + body.length > MAX_TOTAL_BYTES) return null;
      let code;
      do code = Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
      while (entries.has(code));
      entries.set(code, { body, expires: now() + TRANSFER_TTL_MS });
      total += body.length;
      return code;
    },
    take(code) {
      sweep();
      const entry = entries.get(code);
      if (!entry) return null;
      remove(code);
      return entry.body;
    },
  };
}

 
export function createRateLimiter(limit, windowMs, now = Date.now) {
  const hits = new Map();
  return key => {
    const time = now();
    if (hits.size > 5000) for (const [ip, hit] of hits) if (hit.reset <= time) hits.delete(ip);
    const hit = hits.get(key);
    if (!hit || hit.reset <= time) {
      hits.set(key, { count: 1, reset: time + windowMs });
      return true;
    }
    hit.count += 1;
    return hit.count <= limit;
  };
}
