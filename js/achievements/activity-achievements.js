import { gardenAchievementIds } from "../leisure/garden-data.js";
import { tarotAchievementIds } from "../leisure/tarot.js";

// Reconcile recorded collections on load, so older saves receive new milestones
// without repeating a harvest, recipe or paid reading. Never create a garden.
export function activityAchievementIds(player, collection) {
  const garden = player?.garden;
  return [
    ...tarotAchievementIds(collection),
    ...(garden ? gardenAchievementIds({
      harvested: garden.harvested ?? {}, cooked: garden.cooked ?? {},
    }) : []),
  ];
}
