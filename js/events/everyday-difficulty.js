 
 
 
 
 
 
export const LUCK_NOTES = {
  poor: "",
};
export function rollEverydayLuck(choice, player, random = Math.random) {
  const gains = Object.entries(choice.effects ?? {}).filter(([, value]) => value > 0);
  if (!gains.length) return choice;
  const [mainStat] = gains.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  const skill = Math.max(0, Math.min(100, Number(player?.[mainStat]) || 0));
  const roll = random();
  const luck = roll < 0.15 + skill / 500 ? "great" : roll >= 0.65 + skill / 500 ? "poor" : null;
  if (!luck) return choice;
  const effects = Object.fromEntries(Object.entries(choice.effects).map(([stat, value]) => [
    stat,
    luck === "great"
      ? (value > 0 ? value + Math.ceil(value / 2) : Math.trunc(value / 2))
      : (value > 0 ? Math.max(1, Math.floor(value / 2)) : value),
  ]));
  return { ...choice, effects, text: LUCK_NOTES[luck] ? `${choice.text}\n${LUCK_NOTES[luck]}` : choice.text, luck };
}
