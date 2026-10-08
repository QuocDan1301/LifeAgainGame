import { ageEvents1To10 } from "./events-1-10.js";
import { ageEvents11To20 } from "./events-11-20.js";
import { applyEventMedia } from "./event-media.js";
import { createCareerAgeEvents } from "./events-19-21.js";
import { diamondSpecialEvent } from "./special-event-20.js";
import { lostChildSpecialEvent } from "./special-event-10.js";
import { createYoungAdultEvents } from "./events-23-29.js";
export const ageEvents = {};
Object.assign(ageEvents, ageEvents1To10);
// Tuổi 19–21 dùng sự kiện theo ngành thay cho tình huống chung cũ.
Object.assign(ageEvents, Object.fromEntries(
  Object.entries(ageEvents11To20).filter(([age]) => Number(age) < 19 && Number(age) !== 15),
));
applyEventMedia(ageEvents);
ageEvents[10] = [...ageEvents[10], lostChildSpecialEvent];

export function getAgeEvents(age, careerPath) {
  if (age >= 23 && age <= 29) return createYoungAdultEvents(age, careerPath);
  if (age >= 19 && age <= 21) {
    const careerEvents = createCareerAgeEvents(careerPath)[age];
    return age === 20 ? [...careerEvents, diamondSpecialEvent] : careerEvents;
  }
  return ageEvents[age];
}
