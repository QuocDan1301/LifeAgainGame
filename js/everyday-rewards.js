import { getEventCategory } from './event-category.js';
import { balanceEverydayChoices } from './everyday-difficulty.js';

// Resolve once from the authored action, so reloads cannot reroll rewards.
export function enrichEverydayRewards(event, age) {
  if (getEventCategory(event) !== 'everyday' || !event.choices) return event;
  if (event.everydayDifficultyApplied) return event;
  const rewarded = {
    ...event,
    choices: event.choices.map((choice) => {
      if (choice.everydayRewardsApplied) return choice;
      const action = `${choice.label} ${choice.text}`;
      const effects = { ...choice.effects };
      let text = choice.text;
      let money = choice.money;
      const learning = /(?:^|[^\p{L}])(?:đọc|học|tra cứu|ghi|viết|đếm|kiểm tra|đối chiếu|chọn ngăn|tìm hiểu|hướng dẫn|quan sát|công thức)/iu.test(action);
      const wellness = /(?:^|[^\p{L}])(?:nghỉ|ngủ|rửa tay|ăn|bữa|rau|đi bộ|vận động|tập thể dục)/iu.test(action);
      const appearance = /(?:^|[^\p{L}])(?:mặc|trang phục|chải tóc|cắt tóc|chăm da)/iu.test(action);
      const stat = appearance ? 'appearance' : wellness ? 'health' : learning ? 'intelligence' : 'happiness';
      // Only fill empty authored rewards. In particular, a loss must never
      // acquire a bonus just because its result mentions food or learning.
      if (!Object.values(effects).some(value => value !== 0) && !(money < 0)) {
        effects[stat] = 2;
      }
      const hasLoss = Object.values(effects).some(value => value < 0) || money < 0;
      if (!hasLoss && money === undefined && /sinh nhật|lì xì/iu.test(event.title)) {
        money = age < 18 ? 100_000 : 300_000;
        text += '\nTôi còn nhận được một khoản tiền mừng nhỏ từ người thân.';
      } else if (!hasLoss && money === undefined && /bán lại|bán đồ|bán sách|bán được/iu.test(action)) {
        money = age < 18 ? 50_000 : 200_000;
        text += '\nTôi nhận thêm một khoản tiền từ món đồ bán được.';
      } else if (!hasLoss && money === undefined && /nhận thưởng|tiền thưởng|được thưởng/iu.test(action)) {
        money = age < 18 ? 50_000 : 500_000;
        text += '\nPhần thưởng có kèm một khoản tiền nhỏ.';
      }
      return { ...choice, text, effects, ...(money === undefined ? {} : { money }), everydayRewardsApplied: true };
    }),
  };
  return balanceEverydayChoices(rewarded, age);
}
