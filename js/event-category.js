export const eventCategories = {
  special: { label: '✨ Đặc biệt' },
  everyday: { label: '🌿 Đời thường' },
  love: { label: '💕 Tình yêu' },
  family: { label: '🏡 Gia đình' },
  education: { label: '📚 Học tập' },
  career: { label: '💼 Nghề nghiệp' },
};

export function getEventCategory(event) {
  if (Object.hasOwn(eventCategories, event.category)) return event.category;
  if (event.specialId || ['special-chain', 'lost-child-chain'].includes(event.kind)) return 'special';
  if (['workplace-dating', 'marriage-proposal', 'orientation-chain'].includes(event.kind)) return 'love';
  if (event.kind === 'child-proposal') return 'family';
  if (['job-interview', 'job-interview-retry', 'career-promotion', 'enlistment-failure'].includes(event.kind)) return 'career';
  if (event.kind === 'career-test' || event.testedCareer) return 'education';
  // Older saves and ordinary stories do not always carry a structured kind.
  const title = event.mediaSceneTitle ?? event.title ?? '';
  if (/tình yêu|hẹn hò|tỏ tình|cầu hôn|người yêu|mối quan hệ mới|chia tay|đám cưới|tình cảm|rung động/iu.test(title)) return 'love';
  if (/gia đình|nuôi con|sinh con|làm cha|làm mẹ/iu.test(title)) return 'family';
  if (/chọn trường|chọn khối|chọn hướng đi|chọn academy|chọn hướng huấn luyện|bài test|thi cử|tốt nghiệp/iu.test(title)) return 'education';
  if (/phỏng vấn|thử việc|thăng chức|nâng bậc/iu.test(title)) return 'career';
  return 'everyday';
}
