import { openMojiArt } from "./event-art.js";
import { formatMoney } from "./money-format.js";

// Cấu hình tập trung cho cơ chế phụ thuộc Hạnh phúc. Các con số là thông số gameplay.
// Hạnh phúc thấp không gây tử vong, không tự làm mất việc hay chia tay; hạnh phúc cao
// không thay thế trí tuệ hay năng lực chuyên môn (không đổi kết quả phỏng vấn, nâng bậc).

// 70–100 vững vàng, 40–69 bình thường, 20–39 chán nản, 0–19 rất khó khăn.
export const HAPPINESS_BANDS = [
  { id: "steady", min: 70, label: "Vững vàng" },
  { id: "normal", min: 40, label: "Bình thường" },
  { id: "low", min: 20, label: "Chán nản" },
  { id: "crisis", min: -Infinity, label: "Rất khó khăn" },
];
export const getHappinessBand = (happiness) => HAPPINESS_BANDS.find((band) => (Number(happiness) || 0) >= band.min);

// Tinh thần vững vàng (từ 70): thất bại nhỏ trong sự kiện đời thường/công việc chỉ trừ một nửa
// hạnh phúc. Chỉ áp dụng cho mức trừ nhỏ (tối đa 6) và không giảm thiệt hại sức khỏe, tiền bạc.
export const RESILIENCE = { minHappiness: 70, maxLoss: 6, rate: 0.5, categories: ["everyday", "career", "wellbeing"] };
export function softenSetback(player, choice, category) {
  const loss = choice.effects?.happiness;
  if (!(loss < 0) || loss < -RESILIENCE.maxLoss || choice.death || (player.happiness ?? 0) < RESILIENCE.minHappiness ||
      !RESILIENCE.categories.includes(category)) return choice;
  const softened = -Math.ceil(Math.abs(loss) * RESILIENCE.rate);
  return { ...choice, effects: { ...choice.effects, happiness: softened },
    text: `${choice.text}\n🌤️ Tinh thần vững vàng giúp bạn nhẹ lòng hơn.` };
}

// Đếm số năm liên tiếp hạnh phúc dưới 20 (mở chuỗi hỗ trợ) và dưới 40 (tăng áp lực công việc).
export const LOW_HAPPINESS = 20;
export const STRAINED_HAPPINESS = 40;
export const SUPPORT_TRIGGER_YEARS = 3;

// Chuỗi "Bạn đang trải qua giai đoạn khó khăn": hiệu quả ngay + hồi phục mỗi năm trong vài năm.
// Lựa chọn tâm sự luôn miễn phí để nhân vật độc thân hoặc ít tiền vẫn có hỗ trợ cơ bản.
export const SUPPORT_OPTIONS = {
  confide: { immediate: 6, perYear: 3, years: 2 },
  schedule: { immediate: 5, perYear: 3, years: 2, health: 2, promotionDelay: 1 },
  professional: { immediate: 8, perYear: 4, years: 3, cost: 500_000 },
  postpone: { health: -2, happiness: -2, retryAfter: 2 },
};
export const isSupportActive = (player, age) => Boolean(player.moodSupport) && age <= player.moodSupport.untilAge;

// Sự kiện chán nản (20–39) và áp lực công việc (hạnh phúc thấp kéo dài càng dễ gặp).
export const LOW_MOOD_EVENT_CHANCE = { low: 0.3, crisis: 0.4 };
export const WORK_PRESSURE_CHANCE = { base: 0.05, perStrainedYear: 0.1, max: 0.45 };
export const getWorkPressureChance = (player) =>
  Math.min(WORK_PRESSURE_CHANCE.max, WORK_PRESSURE_CHANCE.base + WORK_PRESSURE_CHANCE.perStrainedYear * (player.strainedYears ?? 0));

// Biến cố có tác động kéo dài: trừ hạnh phúc mỗi sinh nhật trong vài năm, giảm dần.
// Năm đang nghỉ dưỡng hoặc đang được hỗ trợ tinh thần thì chỉ chịu một nửa.
// Mức trừ ngay lúc xảy ra nằm ở nơi gây ra biến cố (chia tay, mất việc, mất người thân); ở đây là phần kéo dài.
export const MOOD_EFFECTS = {
  breakup: { icon: "💔", label: "Chia tay", immediate: 5, yearly: [3, 2] },
  // Lo lắng thất nghiệp: chỉ khi còn thất nghiệp, tối đa 2 năm; có việc mới thì hết.
  "job-loss": { icon: "😟", label: "Lo lắng thất nghiệp", yearly: [2, 2], endsWhenEmployed: true },
  // Đau buồn: mức trừ ngay tùy mức gắn kết (xem family-members.js), sau đó −3, −2, −1.
  bereavement: { icon: "🕯️", label: "Mất người thân", yearly: [3, 2, 1] },
};
export const MOOD_EFFECT_RELIEF = 0.5;
// Tránh vòng lặp hình phạt: tổng hao hạnh phúc mỗi năm từ mọi tác động kéo dài tối đa 5 điểm.
export const MOOD_EFFECT_YEARLY_CAP = 5;
export function addMoodEffect(player, id, age, extra = {}) {
  return [...(player.moodEffects ?? []), { id, startedAt: age, ...extra }];
}
// Mức trừ của một tác động ở sinh nhật `age` (0 khi đã hết hạn).
export function getMoodEffectLoss(player, effect, age) {
  const config = MOOD_EFFECTS[effect.id];
  const yearly = (config?.yearly ?? []).slice(0, effect.years ?? config?.yearly.length);
  const ended = Boolean(config?.endsWhenEmployed) && player.employmentStatus === "employed";
  const loss = ended ? 0 : yearly[age - effect.startedAt - 1] ?? 0;
  const relieved = player.restYear === age || isSupportActive(player, age);
  return { config, loss: relieved ? Math.ceil(loss * MOOD_EFFECT_RELIEF) : loss, relieved,
    label: effect.name ? `${config?.label} (${effect.name})` : config?.label,
    yearsLeft: ended ? 0 : Math.max(0, yearly.length - (age - effect.startedAt - 1)) };
}
// Các biến cố đang còn ảnh hưởng tinh thần ở sinh nhật `age`.
export const getActiveMoodEffects = (player, age = player.age + 1) =>
  (player.moodEffects ?? []).filter((effect) => getMoodEffectLoss(player, effect, age).yearsLeft > 0);

// Hoạt động miễn phí cho Hạnh phúc (Phát triển bản thân → Hạnh phúc): mỗi hoạt động một lần mỗi năm,
// hạnh phúc càng thấp càng được nhiều, không thể bấm mãi để lên 100.
export const MOOD_ACTIVITIES = [
  { id: "hobby", stat: "happiness", icon: "🎨", name: "Làm sở thích tại nhà", description: "Miễn phí. Vẽ, nấu món mới hay chăm cây, làm điều mình thích một buổi chiều.",
    gain: { crisis: 4, low: 4, normal: 2, steady: 1 } },
  { id: "community", stat: "happiness", icon: "🤝", name: "Tham gia hoạt động cộng đồng", description: "Miễn phí. Dọn dẹp khu phố, đọc sách ở thư viện, gặp gỡ hàng xóm.",
    gain: { crisis: 4, low: 3, normal: 2, steady: 1 } },
  { id: "call-family", stat: "happiness", icon: "📞", name: "Gọi điện tâm sự với người thân", description: "Miễn phí. Kể cho người mình tin một chuyện đang canh cánh trong lòng.",
    gain: { crisis: 5, low: 4, normal: 2, steady: 1 } },
];

// Tương tác với người yêu/bạn đời: mỗi lựa chọn một lần mỗi năm. Xin không gian riêng không bị phạt
// nếu giữ lời hẹn (trò chuyện trước sinh nhật kế tiếp); bỏ hẹn mới làm giảm mức gắn kết.
export const PARTNER_ACTIONS = {
  talk: { happiness: 3, relationship: 2 },
  together: { happiness: 4, relationship: 3 },
  promiseYears: 1,
  brokenPromise: 5,
};

// Du lịch cùng một điểm đến nhiều năm liên tiếp: 100% → 75% → 50%. Đổi nơi hoặc nghỉ một năm thì đầy đủ.
export const TRAVEL_REPEAT_RATES = [1, 0.75, 0.5];
export function getTravelStreak(player, placeId) {
  const streak = player.travelStreak;
  return streak?.id === placeId && streak.lastAge === player.age - 1 ? streak.count + 1 : 1;
}
export function getTravelGain(player, place) {
  const count = getTravelStreak(player, place.id);
  const rate = TRAVEL_REPEAT_RATES[Math.min(count, TRAVEL_REPEAT_RATES.length) - 1];
  const raw = Math.round(place.happiness * rate);
  return { count, rate, raw, gain: Math.max(0, Math.min(raw, 100 - (player.happiness ?? 0))) };
}

const art = (code, alt) => openMojiArt(code, alt);

// Chuỗi hỗ trợ: mở khi hạnh phúc dưới 20 đủ 3 năm liên tiếp, không lặp khi đang được hỗ trợ
// hoặc vừa trì hoãn (hỏi lại sau 2 năm nếu vẫn khó khăn).
// Nhiều biến cố cùng lúc (ví dụ mất việc và mất người thân) cũng mở lựa chọn hỗ trợ.
export const STACKED_EVENTS_FOR_SUPPORT = 2;
export function createSupportEvent(player, age) {
  const stacked = getActiveMoodEffects(player, age).length >= STACKED_EVENTS_FOR_SUPPORT;
  const lowStreak = (player.lowHappinessYears ?? 0) >= SUPPORT_TRIGGER_YEARS;
  if ((!lowStreak && !stacked) || isSupportActive(player, age) || (player.supportOfferAge ?? 0) > age) return null;
  const trusted = player.partner ? player.partner.name : "một người bạn hoặc người thân";
  const { confide, schedule, professional, postpone } = SUPPORT_OPTIONS;
  const plan = (type, option) => ({ type, startedAt: age, untilAge: age + option.years });
  const working = player.employmentStatus === "employed" && Number.isInteger(player.nextPromotionAge);
  return {
    id: `happiness-support-${age}`,
    kind: "happiness-support",
    category: "wellbeing",
    priority: true,
    title: "🌧️ Bạn đang trải qua giai đoạn khó khăn",
    text: (lowStreak
      ? `Đã ${player.lowHappinessYears} năm liền tôi thấy mọi thứ nặng nề: ngủ không ngon, việc gì cũng thấy mệt, chẳng còn hứng làm điều mình từng thích. `
      : "Nhiều biến cố dồn dập trong thời gian ngắn khiến tôi kiệt sức, ngủ không ngon, việc gì cũng thấy mệt. ") +
      "Đây không phải lỗi của tôi, và tôi không cần tự vượt qua một mình. Tôi muốn làm gì trước?",
    ...art("1F327", "Giai đoạn khó khăn"),
    choices: [
      {
        label: `💬 Tâm sự với ${trusted}`,
        title: "💬 Được lắng nghe",
        text: `Tôi kể cho ${trusted} nghe những gì mình đang trải qua. Không ai có lời giải ngay, nhưng cảm giác được lắng nghe làm lòng nhẹ đi nhiều. Chúng tôi hẹn gặp nhau đều đặn hơn.\nHồi phục thêm +${confide.perYear} hạnh phúc mỗi năm trong ${confide.years} năm tới.`,
        effects: { happiness: confide.immediate },
        playerUpdates: { moodSupport: plan("confide", confide), lowHappinessYears: 0 },
        ...(player.partner ? { partnerRelationship: { id: player.partner.id, value: Math.min(100, (player.partner.relationship ?? 80) + 2) } } : {}),
        confirmText: "Cảm ơn vì đã nghe mình",
        ...art("1F4AC", "Tâm sự với người tin cậy"),
      },
      {
        label: "🗓️ Điều chỉnh lịch làm và nghỉ ngơi",
        title: "🗓️ Một nhịp sống vừa sức hơn",
        text: `Tôi bớt nhận việc ngoài giờ, ngủ đúng giờ và chừa thời gian nghỉ trong tuần.${working ? ` Tôi báo với quản lý nên lần xét nâng bậc lùi ${schedule.promotionDelay} năm.` : ""}\nHồi phục thêm +${schedule.perYear} hạnh phúc mỗi năm trong ${schedule.years} năm tới.`,
        effects: { happiness: schedule.immediate, health: schedule.health },
        playerUpdates: { moodSupport: plan("schedule", schedule), lowHappinessYears: 0,
          ...(working ? { nextPromotionAge: Math.max(player.nextPromotionAge, age) + schedule.promotionDelay } : {}) },
        confirmText: "Sống chậm lại",
        ...art("1F5D3", "Điều chỉnh lịch làm và nghỉ ngơi"),
      },
      {
        label: `🧑‍⚕️ Tìm hỗ trợ chuyên môn (${formatMoney(professional.cost)})`,
        title: "🧑‍⚕️ Có người đồng hành chuyên môn",
        text: `Tôi đặt lịch gặp chuyên viên tâm lý ở cơ sở y tế công. Chuyên viên giúp tôi nhìn lại giai đoạn vừa qua và cùng lên kế hoạch hồi phục từng bước. Một giai đoạn buồn kéo dài chưa chắc là bệnh; việc đánh giá là của người có chuyên môn.\nHồi phục thêm +${professional.perYear} hạnh phúc mỗi năm trong ${professional.years} năm tới.`,
        effects: { happiness: professional.immediate },
        money: -professional.cost,
        playerUpdates: { moodSupport: plan("professional", professional), lowHappinessYears: 0 },
        confirmText: "Bắt đầu hồi phục",
        ...art("1F9D1-200D-2695-FE0F", "Hỗ trợ tâm lý chuyên môn"),
      },
      {
        label: "⏳ Để sau, mình tự cố thêm",
        title: "⏳ Gác lại thêm một thời gian",
        text: `Tôi chưa muốn nói với ai. Những ngày nặng nề vẫn tiếp diễn, giấc ngủ chập chờn khiến sức khỏe giảm theo.\n⚠️ Khi tinh thần kiệt quệ kéo dài, công việc dễ quá tải và khó phục hồi hơn. Lời mời hỗ trợ sẽ quay lại sau ${postpone.retryAfter} năm nếu tôi vẫn khó khăn.`,
        effects: { health: postpone.health, happiness: postpone.happiness },
        playerUpdates: { supportOfferAge: age + postpone.retryAfter },
        confirmText: "Để sau vậy",
        ...art("23F3", "Trì hoãn hỗ trợ"),
      },
    ],
  };
}

// Sự kiện tinh thần trong năm: áp lực công việc (người đang đi làm) hoặc một quãng chán nản.
export function createMoodEvent(player, age, random = Math.random) {
  const band = getHappinessBand(player.happiness).id;
  const working = player.employmentStatus === "employed";
  if (working && random() < getWorkPressureChance(player)) return createWorkPressureEvent(player, age);
  const chance = LOW_MOOD_EVENT_CHANCE[band];
  if (chance && random() < chance) return createLowMoodEvent(player, age);
  return null;
}

function createWorkPressureEvent(player, age) {
  const delay = Number.isInteger(player.nextPromotionAge);
  return {
    id: `work-pressure-${age}`, kind: "work-pressure", category: "career",
    title: "⏰ Dự án sát hạn",
    text: "Dự án của nhóm chỉ còn ba ngày là đến hạn. Việc dồn lên bàn tôi, đầu óc khó tập trung, càng làm càng thấy thiếu động lực.",
    ...art("23F0", "Dự án sát hạn"),
    choices: [
      { label: "🗣️ Trao đổi với quản lý, chia việc trong nhóm", title: "🗣️ Cả nhóm cùng gánh",
        text: "Tôi nói rõ khối lượng việc với quản lý. Cả nhóm chia lại đầu việc, dự án kịp hạn mà tôi không phải thức trắng.",
        effects: { happiness: 3 }, confirmText: "Nhẹ người hẳn", ...art("1F91D", "Phối hợp nhóm") },
      { label: "🛌 Xin giảm nhiệm vụ, nghỉ ngơi vài ngày", title: "🛌 Lùi một bước để hồi sức",
        text: `Tôi xin giao bớt phần việc và nghỉ vài ngày. Tinh thần hồi lại rõ rệt${delay ? ", nhưng lần xét nâng bậc của tôi lùi 1 năm" : ""}.`,
        effects: { happiness: 6, health: 2 },
        ...(delay ? { playerUpdates: { nextPromotionAge: Math.max(player.nextPromotionAge, age) + 1 } } : {}),
        confirmText: "Hồi sức đã", ...art("1F6CC", "Nghỉ ngơi hồi sức") },
      { label: "💪 Ôm hết việc cho kịp hạn", title: "💪 Kịp hạn, nhưng kiệt sức",
        text: "Tôi làm thâu đêm và kịp hạn, được ghi nhận trước mắt. Đổi lại, người mệt rã rời và tâm trạng càng nặng nề.",
        effects: { intelligence: 2, happiness: -4, health: -4 }, confirmText: "Xong rồi…", ...art("1F62B", "Làm việc quá sức") },
    ],
  };
}

function createLowMoodEvent(player, age) {
  const partner = player.partner;
  return {
    id: `low-mood-${age}`, kind: "low-mood", category: "wellbeing",
    title: "😔 Một quãng chán nản",
    text: "Dạo này tôi thấy mọi thứ nhạt nhòa, sáng dậy chẳng muốn làm gì. Việc vẫn còn đó, nhưng lòng thì trống rỗng.",
    ...art("1F614", "Một quãng chán nản"),
    choices: [
      { label: "🛋️ Nghỉ ngơi vài ngày", title: "🛋️ Cho mình được nghỉ",
        text: "Tôi tắt thông báo, ngủ bù và đi dạo chậm. Mọi chuyện chưa hết hẳn nhưng tôi thấy dễ thở hơn.",
        effects: { happiness: 4, health: 1 }, confirmText: "Dễ thở hơn rồi", ...art("1F6CB", "Nghỉ ngơi") },
      { label: partner ? `💬 Tâm sự với ${partner.name}` : "💬 Tâm sự với một người bạn", title: "💬 Có người cùng nghe",
        text: `Tôi kể cho ${partner ? partner.name : "một người bạn"} nghe điều đang làm mình nặng lòng. Chỉ cần được lắng nghe, tôi đã thấy nhẹ đi một nửa.`,
        effects: { happiness: 5 },
        ...(partner ? { partnerRelationship: { id: partner.id, value: Math.min(100, (partner.relationship ?? 80) + 2) } } : {}),
        confirmText: "Cảm ơn nhé", ...art("1F4AC", "Tâm sự") },
      { label: "📂 Cứ tiếp tục làm việc như thường", title: "📂 Cố gắng cho qua",
        text: "Tôi lao vào việc để khỏi nghĩ. Công việc vẫn trôi, nhưng cảm giác nặng nề chưa đi đâu cả.",
        effects: { intelligence: 1, happiness: -2 }, confirmText: "Thôi cứ làm tiếp", ...art("1F4C2", "Tiếp tục làm việc") },
    ],
  };
}

// Mỗi sinh nhật: tác động kéo dài, hồi phục từ hỗ trợ, lời hẹn với người yêu, đếm năm hạnh phúc thấp.
export function collectMoodYear(player, age) {
  const lines = [];
  const clamp = (value) => Math.max(0, Math.min(100, value));
  // Hồi phục từ chuỗi hỗ trợ đang diễn ra.
  const support = player.moodSupport;
  if (support && age > support.startedAt && age <= support.untilAge) {
    const option = SUPPORT_OPTIONS[support.type];
    const before = player.happiness;
    player.happiness = clamp(before + option.perYear);
    lines.push(`🌱 Đang được hỗ trợ tinh thần: Hạnh phúc +${player.happiness - before}` +
      (support.untilAge > age ? ` (còn ${support.untilAge - age} năm).` : " (chặng hỗ trợ đã hoàn thành)."));
  }
  // Tác động kéo dài của biến cố, giảm dần theo năm.
  const remaining = [];
  let budget = MOOD_EFFECT_YEARLY_CAP;
  for (const effect of player.moodEffects ?? []) {
    const { config, loss: fullLoss, relieved, yearsLeft } = getMoodEffectLoss(player, effect, age);
    if (!config || yearsLeft <= 0) continue;
    // Tổng mức trừ của mọi tác động trong năm không vượt MOOD_EFFECT_YEARLY_CAP.
    const loss = Math.min(fullLoss, budget);
    budget -= loss;
    if (loss) {
      const before = player.happiness;
      player.happiness = clamp(before - loss);
      lines.push(`${config.icon} Vẫn còn ảnh hưởng vì ${config.label.toLowerCase()}${effect.name ? ` (${effect.name})` : ""}: Hạnh phúc -${before - player.happiness}` +
        `${relieved ? " (nghỉ ngơi và hỗ trợ giúp nhẹ bớt)" : ""}${yearsLeft > 1 ? `, còn ${yearsLeft - 1} năm ảnh hưởng` : ", đây là năm cuối"}.`);
    }
    if (yearsLeft > 1) remaining.push(effect);
  }
  player.moodEffects = remaining;
  // Lời hẹn trò chuyện với người yêu: bỏ hẹn mới bị giảm gắn kết.
  const promise = player.partnerPromise;
  if (promise && age > promise.dueAge) {
    if (player.partner && player.partner.id === promise.partnerId) {
      const relationship = Math.max(0, (player.partner.relationship ?? 80) - PARTNER_ACTIONS.brokenPromise);
      player.partner = { ...player.partner, relationship };
      lines.push(`🤐 Tôi đã hẹn sẽ nói chuyện với ${player.partner.name} nhưng không giữ lời: Quan hệ -${PARTNER_ACTIONS.brokenPromise}%.`);
    }
    player.partnerPromise = null;
  }
  // Đếm năm liên tiếp hạnh phúc thấp.
  player.lowHappinessYears = player.happiness < LOW_HAPPINESS ? (player.lowHappinessYears ?? 0) + 1 : 0;
  player.strainedYears = player.happiness < STRAINED_HAPPINESS ? (player.strainedYears ?? 0) + 1 : 0;
  if (player.lowHappinessYears && player.lowHappinessYears < SUPPORT_TRIGGER_YEARS && !isSupportActive(player, age)) {
    lines.push(`😔 Hạnh phúc dưới ${LOW_HAPPINESS} đã ${player.lowHappinessYears} năm liên tiếp. Hãy nghỉ ngơi, tâm sự hoặc làm điều mình thích (Phát triển bản thân → Hạnh phúc).`);
  }
  return lines.length ? { content: lines.join("\n") } : null;
}
