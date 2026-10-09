import { everydayAdditions } from "./everyday-additions-data.js";
import { openMojiArt } from "./event-art.js";
import { enrichEverydayRewards } from "./everyday-rewards.js";

export function createEverydayAdditions(age) {
  if (age === 24) return [];
  return (everydayAdditions[age] ?? []).map(([code, title, text, first, firstText, second, secondText], index) => ({
    id: `everyday-added-${age}-${index + 1}`, kind: "everyday", addedEveryday: true,
    title, text, ...openMojiArt(code, title),
    choices: [[first, firstText], [second, secondText]].map(([label, result]) => ({
      label, title: "Một chuyện nhỏ trong ngày", text: result,
      effects: {},
      ...openMojiArt(code, title), confirmText: "Tiếp tục", achievementIds: [],
    })),
  })).map(event => enrichEverydayRewards(event, age));
}
