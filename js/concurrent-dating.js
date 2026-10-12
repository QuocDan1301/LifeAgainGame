import { createDatingDramaStep } from './dating-drama.js';

export const MAX_DATING_PARTNERS = 2;
export const DATING_DISCOVERY_CHANCE = 0.25;
const contextKeys = ['relationshipStartedAtAge', 'nextMarriageProposalAge', 'marriageProposalDeclines',
  'partnerActions', 'partnerPromise'];

export function getDatingPartners(player) {
  const seen = new Set();
  return [player.partner, ...(player.otherPartners ?? [])].filter(person => {
    if (!person?.id || person.isAlive === false || person.deceased || seen.has(person.id)) return false;
    seen.add(person.id);
    return true;
  });
}

const initialContext = (person, age) => ({ relationshipStartedAtAge: age,
  nextMarriageProposalAge: age + 5, marriageProposalDeclines: 0, partnerActions: {}, partnerPromise: null });
const contextOf = (player, person) => person.id === player.partner?.id
  ? Object.fromEntries(contextKeys.map(key => [key, player[key] ?? initialContext(person, person.metAtAge ?? player.age)[key]]))
  : { ...initialContext(person, person.metAtAge ?? player.age), ...person.datingState };

// partner remains the selected person for existing stories, gifts and family UI.
// Store each person's schedule and actions when switching; never reset them.
export function selectDatingPartnerUpdates(player, id) {
  const people = getDatingPartners(player);
  const selected = people.find(person => person.id === id);
  if (!selected || (player.marriedAtAge != null && id !== player.partner?.id)) return {};
  return { partner: selected, otherPartners: people.filter(person => person.id !== id)
    .map(person => ({ ...person, datingState: contextOf(player, person) })), ...contextOf(player, selected) };
}

export function addDatingPartnerUpdates(player, person, age) {
  if (player.isAlive === false || player.marriedAtAge != null || !person?.id || person.isAlive === false) return {};
  const people = getDatingPartners(player);
  if (people.length >= MAX_DATING_PARTNERS || people.some(item => item.id === person.id)) return {};
  if (player.partner) return { otherPartners: [...(player.otherPartners ?? []), {
    ...person, datingState: initialContext(person, age),
  }], concurrentDatingStartedAtAge: age };
  return { partner: person, otherPartners: [], ...initialContext(person, age) };
}

export function removeDatingPartnerUpdates(player, id) {
  const people = getDatingPartners(player).filter(person => person.id !== id);
  if (id !== player.partner?.id) return { otherPartners: people.filter(person => person.id !== player.partner?.id) };
  if (people.length) return { partner: people[0], otherPartners: people.slice(1), ...contextOf(player, people[0]) };
  return { partner: null, otherPartners: [], relationshipStartedAtAge: null, nextMarriageProposalAge: null,
    marriageProposalDeclines: 0, partnerActions: {}, partnerPromise: null };
}

export function postponeDatingMarriage(player, id, age) {
  if (id === player.partner?.id) player.nextMarriageProposalAge = age;
  else player.otherPartners = (player.otherPartners ?? []).map(person => person.id === id
    ? { ...person, datingState: { ...contextOf(player, person), nextMarriageProposalAge: age } } : person);
}

export function createConcurrentDatingEvent(player, age, random = Math.random) {
  const people = getDatingPartners(player);
  if (player.isAlive === false || player.marriedAtAge != null || people.length !== 2 ||
      age <= (player.concurrentDatingStartedAtAge ?? -1) || age <= (player.concurrentDatingLastEventAge ?? -1) ||
      random() >= DATING_DISCOVERY_CHANCE) return null;
  return createDatingDramaStep(player, age);
}
