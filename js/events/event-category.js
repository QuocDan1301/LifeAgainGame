export const eventCategories = {
  special: { label: '✨ Đặc biệt' },
  everyday: { label: '🌿 Đời thường' },
  love: { label: '💕 Tình yêu' },
  family: { label: '🏡 Gia đình' },
  education: { label: '📚 Học tập' },
  career: { label: '💼 Nghề nghiệp' },
  wellbeing: { label: '🌱 Tinh thần' },
  finance: { label: '💰 Tài chính' },
  social: { label: '👫 Kết bạn' },
};

const eventDetails = {
  "career-promotion": { id: "promotion", label: "📈 Nâng bậc", tone: "promotion" },
  "job-interview": { id: "interview", label: "🗣️ Phỏng vấn" },
  "job-interview-retry": { id: "interview", label: "🗣️ Phỏng vấn" },
  "job-warning": { id: "warning", label: "📋 Cảnh báo" },
  "job-review": { id: "review", label: "📋 Đánh giá lại" },
  "layoff-notice": { id: "layoff", label: "📉 Cắt giảm nhân sự" },
  "contract-notice": { id: "contract", label: "📄 Hợp đồng" },
  "work-temptation": { id: "temptation", label: "⚖️ Cám dỗ" },
  "work-investigation": { id: "investigation", label: "⚖️ Điều tra" },
  "exam-prep": { id: "exam-prep", label: "📝 Ôn thi" },
  "career-test": { id: "exam", label: "📝 Kiểm tra" },
  "marriage-proposal": { id: "proposal", label: "💍 Cầu hôn" },
  "child-proposal": { id: "children", label: "👶 Đón con" },
  dream: { id: "dream", label: "🌟 Ước mơ dang dở" },
  "workplace-dating": { id: "dating", label: "💌 Hẹn hò" },
  "happiness-support": { id: "support", label: "🤝 Hỗ trợ" },
  "low-mood": { id: "support", label: "🤝 Hỗ trợ" },
};

const dangerousEventKinds = new Set([
  "job-warning", "job-review", "layoff-notice", "contract-notice",
  "work-temptation", "work-investigation", "risk-offer",
]);

export function getEventTags(event) {
  const category = getEventCategory(event);
  const tags = [{ id: category, label: eventCategories[category].label, category }];
  const kind = event.eventTagKind ?? event.kind;
  const detail = eventDetails[kind];
  if (detail) tags.push({ ...detail });
  // Use the situation, not a randomly chosen outcome, to avoid revealing results.
  const hasDanger = dangerousEventKinds.has(kind) || event.danger === true
    || event.death === true || (event.choices ?? []).some(choice =>
      choice.death === true || Boolean(choice.prison || choice.playerUpdates?.prison));
  if (hasDanger) tags.push({ id: "danger", label: "⚠️ Nguy hiểm", tone: "danger" });
  return tags;
}

export function renderEventTags(container, event) {
  container.dataset.category = getEventCategory(event);
  container.replaceChildren(...getEventTags(event).map(tag => {
    const badge = document.createElement("span");
    badge.className = "event-tag";
    badge.dataset.tag = tag.id;
    if (tag.category) badge.dataset.category = tag.category;
    if (tag.tone) badge.dataset.tone = tag.tone;
    badge.textContent = tag.label;
    return badge;
  }));
}

export function getEventCategory(event) {
  if (Object.hasOwn(eventCategories, event.category)) return event.category;
  if (event.specialId || ['special-chain', 'lost-child-chain'].includes(event.kind)) return 'special';
  if (['workplace-dating', 'marriage-proposal', 'orientation-chain'].includes(event.kind)) return 'love';
  if (event.kind === 'child-proposal') return 'family';
  if (['happiness-support', 'low-mood'].includes(event.kind)) return 'wellbeing';
  if (['work-pressure', 'project-bug', 'job-warning', 'job-review', 'layoff-notice', 'contract-notice'].includes(event.kind)) return 'career';
  if (event.kind === 'relative-death') return 'family';
  if (['exam-prep'].includes(event.kind)) return 'education';
  if (['job-interview', 'job-interview-retry', 'career-promotion', 'career-spark', 'career-spark-pick', 'enlistment-failure'].includes(event.kind)) return 'career';
  if (event.kind === 'career-test' || event.testedCareer) return 'education';
  // Older saves and ordinary stories do not always carry a structured kind.
  const title = event.mediaSceneTitle ?? event.title ?? '';
  if (/tình yêu|hẹn hò|tỏ tình|cầu hôn|người yêu|mối quan hệ mới|chia tay|đám cưới|tình cảm|rung động/iu.test(title)) return 'love';
  if (/gia đình|nuôi con|sinh con|làm cha|làm mẹ/iu.test(title)) return 'family';
  if (/chọn trường|chọn khối|chọn hướng đi|chọn academy|chọn hướng huấn luyện|bài test|thi cử|tốt nghiệp/iu.test(title)) return 'education';
  if (/phỏng vấn|thử việc|thăng chức|nâng bậc/iu.test(title)) return 'career';
  return 'everyday';
}
