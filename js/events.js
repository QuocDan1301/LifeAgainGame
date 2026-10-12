import { diamondSpecialEvent } from "./special-event-20.js";
import { lostChildSpecialEvent } from "./special-event-10.js";
import { earthAuctionSpecialEvent } from "./special-event-30.js";
import { saveLifeSpecialEvent } from "./special-event-35.js";
import { oldHouseSpecialEvent } from "./special-event-40.js";
import { createLastTrainSpecialEvent } from "./special-event-45.js";
import { theaterSpecialEvent } from "./special-event-50.js";
import { luggageSpecialEvent } from "./special-event-55.js";
import { createLaterSpecialEvent } from "./special-later-life.js";
import { reviewEventMedia } from "./semantic-event-media.js";
import { createLifeStoryEvents } from "./life-stories.js";
import { createCareerSparkEvents } from "./career-milestones.js";

// Sự kiện đặc biệt gắn cố định với một tuổi. Sự kiện đời thường nằm ở js/life-stories.
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
    event?.kind === "career-promotion" || event?.kind === "career-spark" || event?.kind === "orientation-chain" ||
    event?.kind === "job-interview" || event?.kind === "job-interview-retry");
}

// Chỉ trả về sự kiện đặc biệt của tuổi đó (không gồm sự kiện đời thường).
export function getBaseAgeEvents(age, careerPath, player = {}) {
  // Tuổi 16 chỉ có chuỗi khám phá một ngành, thay cho mọi sự kiện đời thường.
  if (age === 16) return createCareerSparkEvents(player.studyBlock, Math.random, player);
  if (age === 105) return [createLaterSpecialEvent(age, player)];
  if (age === 45) return [createLastTrainSpecialEvent(player)];
  const fixed = ageEvents[age] ?? [];
  // 50 và 55 có sự kiện riêng; các tuổi khác từ 51 tới 104 có thể có sự kiện đặc biệt tuổi già.
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
  return [...reserved, ...createLifeStoryEvents(age, player)].map(event => reviewEventMedia({ ...event, age }));
}
