import { getDatingPartners } from './concurrent-dating.js';

export const DATING_COST_MIN = 6_000_000;
export const DATING_COST_MAX = 24_000_000;
const COST_STEP = 1_000_000;

 
 
export function annualDatingCost(person, age, startedAtAge) {
  let seed = 2166136261;
  for (const char of `dating-v1:${person.id}:${startedAtAge ?? person.metAtAge ?? ''}:${age}`) {
    seed = Math.imul(seed ^ char.codePointAt(0), 16777619) >>> 0;
  }
  seed ^= seed >>> 16;
  seed = Math.imul(seed, 0x7feb352d);
  seed ^= seed >>> 15;
  seed = Math.imul(seed, 0x846ca68b);
  seed = (seed ^ (seed >>> 16)) >>> 0;
  return DATING_COST_MIN + (seed % ((DATING_COST_MAX - DATING_COST_MIN) / COST_STEP + 1)) * COST_STEP;
}

export function getDatingExpenses(player, age) {
  if (age < 18 || player.isAlive === false || player.marriedAtAge != null ||
      (player.prison && player.prison.releaseAge >= age)) return [];
  return getDatingPartners(player).flatMap(person => {
    const pays = player.gender === 'male' || (player.gender === 'female' && person.gender === 'female');
    if (!pays) return [];
    const startedAtAge = (person.id === player.partner?.id
      ? player.relationshipStartedAtAge : person.datingState?.relationshipStartedAtAge) ?? person.metAtAge;
     
    if (Number.isFinite(startedAtAge) && age <= startedAtAge) return [];
    return [{ kind: 'dating', id: person.id, name: person.name,
      amount: annualDatingCost(person, age, startedAtAge), bond: 0,
      label: 'Chi phí hẹn hò (ăn uống, đi lại, dịp kỷ niệm)' }];
  });
}
