 

export function hashText(text) {
  let hash = 7;
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return hash;
}

 
export function getLifeSeed(player = {}) {
  if (Number.isInteger(player?.lifeSeed)) return player.lifeSeed >>> 0;
  return hashText(`${player?.name ?? ""}|${player?.province ?? ""}`);
}

 
export function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 2 ** 32;
  };
}

 
export const lifeRandom = (player, key) => seededRandom(hashText(`${getLifeSeed(player)}|${key}`));
