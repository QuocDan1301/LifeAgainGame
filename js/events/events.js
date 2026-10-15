import { createCasualLifeEvents } from "./casual-life.js";
import { diamondSpecialEvent } from "../special-events/special-event-20.js";
import { lostChildSpecialEvent } from "../special-events/special-event-10.js";
import { earthAuctionSpecialEvent } from "../special-events/special-event-30.js";
import { saveLifeSpecialEvent } from "../special-events/special-event-35.js";
import { oldHouseSpecialEvent } from "../special-events/special-event-40.js";
import { createLastTrainSpecialEvent } from "../special-events/special-event-45.js";
import { theaterSpecialEvent } from "../special-events/special-event-50.js";
import { luggageSpecialEvent } from "../special-events/special-event-55.js";
import { createCentennialMemorial, createLaterSpecialEvent } from "../special-events/special-later-life.js";
import { reviewEventMedia } from "../media/semantic-event-media.js";
import { createLifeStoryEvents } from "./life-stories.js";
import { createCareerSparkPickEvent } from "../career/career-milestones.js";
import { isOrderedSpecialChain, orderSpecialChoices } from "../special-events/special-chain.js";

 
export const ageEvents = {
  10: [lostChildSpecialEvent],
  20: [diamondSpecialEvent],
  30: [earthAuctionSpecialEvent],
  35: [saveLifeSpecialEvent],
  40: [oldHouseSpecialEvent],
  50: [theaterSpecialEvent],
  55: [luggageSpecialEvent],
};

// Future special stories can opt in with priority: true or specialId.
export function isPriorityEvent(event) {
  if (event?.priority === false) return false;
  return Boolean(event?.priority || event?.specialId ||
    event?.kind === "special-chain" || event?.kind === "lost-child-chain" ||
    event?.kind === "career-promotion" || event?.kind === "career-spark" || event?.kind === "career-spark-pick" || event?.kind === "orientation-chain" ||
    event?.kind === "job-interview" || event?.kind === "job-interview-retry");
}

 
 
export function getBaseAgeEvents(age, careerPath, player = {}) {
  return createBaseAgeEvents(age, careerPath, player)
    .map(event => isOrderedSpecialChain(event) ? orderSpecialChoices(event, player) : event);
}

function createBaseAgeEvents(age, careerPath, player) {
   
  if (age === 16) return [createCareerSparkPickEvent(player.studyBlock, player)].filter(Boolean);
  if (age === 105) return [createLaterSpecialEvent(age, player)];
  if (age === 45) return [createLastTrainSpecialEvent(player)];
  const memorial = age === 100 ? createCentennialMemorial(player) : null;
  const fixed = [...(ageEvents[age] ?? []), ...(memorial ? [memorial] : [])];
   
  if (age >= 51 && age <= 104 && age !== 55) {
    const special = createLaterSpecialEvent(age, player);
    return [...fixed, ...(special ? [special] : [])];
  }
  return fixed;
}

export function getAgeEvents(age, careerPath, player = {}) {
  const reserved = getBaseAgeEvents(age, careerPath, player).filter(event =>
    isPriorityEvent(event) || event.specialId || event.choices?.some(choice => choice.memory || choice.keepsake),
  ).map(event => event.choices?.some(choice => choice.memory) && !event.specialId
    ? { ...event, category: "special" } : event);
  const casual = createCasualLifeEvents(age, player);
  return [...reserved, ...(casual.length ? casual : createLifeStoryEvents(age, player))].map(event => reviewEventMedia({ ...event, age }));
}
