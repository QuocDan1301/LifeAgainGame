import { vietnamStories, vietnamStoryFallbacks } from './vietnam-story-data.js';
import { openMojiArt } from './event-art.js';
import { RETIREMENT_AGE } from './career-salary.js';

const conditionNames = {
  employed: 'đang có việc làm, chưa đến tuổi nghỉ hưu',
  student: 'đang theo học ngành phù hợp',
  partner: 'đang có người yêu hoặc bạn đời',
  children: 'có con', father: 'ba còn sống', mother: 'mẹ còn sống',
  extendedFamily: 'có người thân tương ứng được xác nhận',
  vehicle: 'sở hữu phương tiện phù hợp', rental: 'đang thuê chỗ ở',
  mobile: 'sức khỏe từ 30, đủ sức tham gia hoạt động nhẹ',
};

export function meetsStoryConditions(story, player = {}) {
  if (player.isAlive === false) return false;
  if ((player.money ?? 0) < story.conditions.minimumMoney) return false;
  return story.conditions.required.every(condition => {
    switch (condition) {
      case 'employed': return player.employmentStatus === 'employed' && story.age < RETIREMENT_AGE;
      case 'student': return story.age >= 18 && story.age <= 21 &&
        Boolean(player.careerPath) && !['military', 'esports', 'football'].includes(player.careerPath.id);
      case 'partner': return Boolean(player.partner);
      case 'children': return Boolean(player.children?.length);
      case 'father': case 'mother': return player.relatives?.some(relative => relative.id === condition && relative.alive === true) === true;
      case 'mobile': return (player.health ?? 0) >= 30;
      // No housing or extended-family ownership is tracked by the current game.
      // Use the authored alternative rather than assert that it exists.
      case 'rental': case 'extendedFamily': return false;
      case 'vehicle': return player.purchases?.some(item => /xe đạp|xe máy|ô tô|motorcycle|bicycle/iu.test(`${item.id} ${item.name}`)) === true;
      default: return false;
    }
  });
}

function conditionDescription(story) {
  const requirements = story.conditions.required.map(key => conditionNames[key]);
  if (story.conditions.minimumMoney) requirements.push(`có ít nhất ${story.conditions.minimumMoney.toLocaleString('vi-VN')} VNĐ`);
  return `Tuổi ${story.age}; còn sống${requirements.length ? '; ' + requirements.join('; ') : ''}.`;
}

export function createVietnamEverydayEvents(age, player = {}) {
  if (player.isAlive === false || !vietnamStories[age]) return [];
  return vietnamStories[age].map((primary, slot) => {
    const story = meetsStoryConditions(primary, player) ? primary : vietnamStoryFallbacks[age][slot];
    const art = openMojiArt(age < 6 ? '1F9F8' : age < 18 ? '1F4DA' : '1F4AC', story.title);
    return {
      ...story, ...art,
      id: primary.id,
      kind: 'everyday', category: 'everyday', catalogVersion: 1,
      conditionText: conditionDescription(story),
      automaticResult: story.mode === 'automatic',
      everydayDifficultyApplied: true,
      choices: story.choices.map((choice, index) => ({
        ...choice, ...art, effects: { ...choice.effects },
        achievementIds: choice.achievementIds?.length ? choice.achievementIds : primary.choices[index]?.achievementIds ?? [],
        everydayRewardsApplied: true,
        confirmText: story.mode === 'automatic' ? 'Đồng ý' : 'Tiếp tục',
      })),
    };
  });
}
