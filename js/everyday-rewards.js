import { getEventCategory } from './event-category.js';

// Resolve once from the authored action, so reloads cannot reroll rewards.
export function enrichEverydayRewards(event, age) {
  if (getEventCategory(event) !== 'everyday' || !event.choices) return event;
  return {
    ...event,
    choices: event.choices.map((choice, index) => {
      if (choice.everydayRewardsApplied) return choice;
      const action = `${choice.label} ${choice.text}`;
      const effects = { ...choice.effects };
      let text = choice.text;
      let money = choice.money;
      const learning = /đọc|học|tra cứu|ghi lại|ghi nhớ|đếm|kiểm tra|tìm hiểu|hướng dẫn|quan sát|công thức/iu.test(action);
      const wellness = /nghỉ|ngủ|rửa tay|ăn|bữa|rau|đi bộ|vận động|tập thể dục/iu.test(action);
      const appearance = /mặc|trang phục|chải tóc|cắt tóc|chăm da/iu.test(action);
      const stat = appearance ? 'appearance' : wellness ? 'health' : learning ? 'intelligence' : 'happiness';
      if (effects[stat] === undefined) effects[stat] = 1 + ((age + index) % 3);
      // Added stories used to share the same two reward templates.
      if (event.addedEveryday) {
        effects[stat] = 2 + ((age + index) % 2);
        if (stat !== 'happiness' && effects.happiness === undefined) effects.happiness = 1;
      }
      const effort = /tự sửa|tự làm|dọn|lau|sắp xếp|ôn bài|ôn thi|luyện tập|tập luyện|chạy bộ/iu.test(choice.label);
      const tired = /mệt mỏi|hơi mỏi|mất ngủ|thiếu ngủ|thức khuya|kiệt sức/iu.test(action);
      if ((tired || (effort && age >= 12 && age < 65)) && effects.health === undefined) {
        effects.health = -1;
        if (!tired) text += '\nTôi hơi thấm mệt sau khi làm xong, cần nghỉ một chút.';
      }
      if (money === undefined && /sinh nhật|lì xì/iu.test(event.title)) {
        money = age < 18 ? 100_000 : 300_000;
        text += '\nTôi còn nhận được một khoản tiền mừng nhỏ từ người thân.';
      } else if (money === undefined && /bán lại|bán đồ|bán sách|bán được/iu.test(action)) {
        money = age < 18 ? 50_000 : 200_000;
        text += '\nTôi nhận thêm một khoản tiền từ món đồ bán được.';
      } else if (money === undefined && /nhận thưởng|tiền thưởng|được thưởng/iu.test(action)) {
        money = age < 18 ? 50_000 : 500_000;
        text += '\nPhần thưởng có kèm một khoản tiền nhỏ.';
      }
      return { ...choice, text, effects, ...(money === undefined ? {} : { money }), everydayRewardsApplied: true };
    }),
  };
}
