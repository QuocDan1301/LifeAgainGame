import { createLostChildSpecialStep } from "./special-event-10.js";
import { createDiamondSpecialStep } from "./special-event-20.js";
import { createEarthAuctionSpecialStep } from "./special-event-30.js";
import { createSaveLifeSpecialStep } from "./special-event-35.js";
import { createOldHouseSpecialStep } from "./special-event-40.js";
import { createLastTrainSpecialStep } from "./special-event-45.js";
import { createTheaterSpecialStep } from "./special-event-50.js";
import { createLuggageSpecialStep } from "./special-event-55.js";
import { createLaterSpecialStep } from "./special-later-life.js";
import { lifeRandom } from "../core/life-seed.js";

 
 
 

 
export function tagSourceIndex(event) {
  if (!event?.choices) return event;
  return { ...event, choices: event.choices.map((choice, index) => ({ ...choice, sourceIndex: choice.sourceIndex ?? index })) };
}

export function orderSpecialChoices(event, player) {
  const tagged = tagSourceIndex(event);
  if (!tagged?.choices || tagged.choices.length < 2) return tagged;
  const random = lifeRandom(player, `${tagged.specialId}|${tagged.specialStep}`);
  const choices = tagged.choices;
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [choices[index], choices[swapIndex]] = [choices[swapIndex], choices[index]];
  }
  return tagged;
}

export const isOrderedSpecialChain = event => event?.kind === "special-chain" || event?.kind === "lost-child-chain";

 
export function createAuthoredSpecialStep(kind, specialId, stepNumber, inventory = {}, player = {}) {
  if (kind === "lost-child-chain") return createLostChildSpecialStep(stepNumber);
  if (specialId?.startsWith("later-")) return createLaterSpecialStep(Number(specialId.slice(6)), stepNumber, inventory);
  if (specialId === "earth-auction") return createEarthAuctionSpecialStep(stepNumber);
  if (specialId === "save-life") return createSaveLifeSpecialStep(stepNumber, player);
  if (specialId === "old-house") return createOldHouseSpecialStep(stepNumber);
  if (specialId === "last-train") return createLastTrainSpecialStep(stepNumber, inventory);
  if (specialId === "theater") return createTheaterSpecialStep(stepNumber);
  if (specialId === "luggage") return createLuggageSpecialStep(stepNumber);
  return createDiamondSpecialStep(stepNumber, inventory);
}

 
export function applySpecialInventory(inventory, choice) {
  const next = { ...(inventory ?? {}) };
  if (choice.grants) next[choice.grants] = true;
  return Object.assign(next, choice.inventoryChanges ?? {});
}

export function createSpecialStep(kind, specialId, stepNumber, inventory = {}, player = {}) {
  const step = createAuthoredSpecialStep(kind, specialId, stepNumber, inventory, player);
  return step ? orderSpecialChoices(step, player) : null;
}
