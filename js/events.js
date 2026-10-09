import { ageEvents1To10 } from "./events-1-10.js";
import { ageEvents11To20 } from "./events-11-20.js";
import { applyEventMedia } from "./event-media.js";
import { createCareerAgeEvents } from "./events-19-21.js";
import { diamondSpecialEvent } from "./special-event-20.js";
import { lostChildSpecialEvent } from "./special-event-10.js";
import { createYoungAdultEvents } from "./events-23-29.js";
import { createAdultEvents } from "./events-29-39.js";
import { createMidlifeEvents } from "./events-40-49.js";
import { createLaterLifeEvents } from "./events-50-105.js";
import { earthAuctionSpecialEvent } from "./special-event-30.js";
import { saveLifeSpecialEvent } from "./special-event-35.js";
import { oldHouseSpecialEvent } from "./special-event-40.js";
import { createLastTrainSpecialEvent } from "./special-event-45.js";
import { theaterSpecialEvent } from "./special-event-50.js";
import { luggageSpecialEvent } from "./special-event-55.js";
import { createLaterSpecialEvent, createCentennialMemorial } from "./special-later-life.js";
import { createEverydayAdditions } from "./everyday-additions.js";
import { reviewEventMedia } from "./semantic-event-media.js";
import { enrichEverydayRewards } from "./everyday-rewards.js";
export const ageEvents = {};

// Future special stories can opt in with priority: true or specialId.
export function isPriorityEvent(event) {
  if (event?.priority === false) return false;
  return Boolean(event?.priority || event?.specialId ||
    event?.kind === "special-chain" || event?.kind === "lost-child-chain" ||
    event?.kind === "career-promotion" || event?.kind === "orientation-chain" ||
    event?.kind === "job-interview" || event?.kind === "job-interview-retry");
}
Object.assign(ageEvents, ageEvents1To10);
// Tuổi 19–21 dùng sự kiện theo ngành thay cho tình huống chung cũ.
Object.assign(ageEvents, Object.fromEntries(
  Object.entries(ageEvents11To20).filter(([age]) => Number(age) < 19 && Number(age) !== 15),
));
applyEventMedia(ageEvents);
ageEvents[10] = [...ageEvents[10], lostChildSpecialEvent];

export function getBaseAgeEvents(age, careerPath, player = {}) {
  if (age === 24) return [];
  if (age === 50) return [...createLaterLifeEvents(age), theaterSpecialEvent, ...(ageEvents[age] ?? [])];
  if (age === 55) return [...createLaterLifeEvents(age), luggageSpecialEvent, ...(ageEvents[age] ?? [])];
  if (age === 105) return [createLaterSpecialEvent(age, player)];
  if (age >= 50 && age <= 104) {
    const special = createLaterSpecialEvent(age, player);
    const ordinary = createLaterLifeEvents(age);
    const memorial = age === 100 ? createCentennialMemorial(player) : null;
    if (memorial) ordinary[0] = memorial;
    return [...ordinary, ...(special ? [special] : []), ...(ageEvents[age] ?? [])];
  }
  if (age === 45) return [...createMidlifeEvents(age), createLastTrainSpecialEvent(player), ...(ageEvents[age] ?? [])];
  if (age === 40) return [...createMidlifeEvents(age), oldHouseSpecialEvent, ...(ageEvents[age] ?? [])];
  if (age >= 40 && age <= 49) return [...createMidlifeEvents(age), ...(ageEvents[age] ?? [])];
  if (age === 25) return [];
  if (age === 29) return [...createYoungAdultEvents(age, careerPath), ...createAdultEvents(age)];
  if (age === 30) return [...createAdultEvents(age), earthAuctionSpecialEvent];
  if (age === 35) return [...createAdultEvents(age), saveLifeSpecialEvent];
  if (age >= 31 && age <= 39) return createAdultEvents(age);
  if (age >= 23 && age <= 29) return createYoungAdultEvents(age, careerPath);
  if (age >= 19 && age <= 21) {
    const careerEvents = createCareerAgeEvents(careerPath)[age];
    return age === 20 ? [...careerEvents, diamondSpecialEvent] : careerEvents;
  }
  return ageEvents[age];
}

export function getAgeEvents(age, careerPath, player = {}) {
  return [...(getBaseAgeEvents(age, careerPath, player) ?? []), ...createEverydayAdditions(age)].map(event => reviewEventMedia(enrichEverydayRewards({ ...event, age }, age)));
}
