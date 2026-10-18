import { saveGame } from "../core/save-store.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import {
  TAROT_DISCOUNT_MAX,
  consumeTarotBuff,
  getActiveTarotBuff,
  getTarotDiscountedFee,
  getTarotStatBonus,
} from "../leisure/tarot.js";
import {
  HEAVY_TRAINING,
  LIGHT_TRAINING,
  RECOVERY_ACTIVITIES,
  getHealthBand,
  isWeakForTraining,
} from "./health-rules.js";
import { MOOD_ACTIVITIES, getHappinessBand } from "./mood-rules.js";
import {
  HIGH_INTELLECT_TRAINING_RATE,
  INTELLECT_ACTIVITIES,
  PROMOTION,
  getIntellectBand,
} from "./intellect-rules.js";
import {
  APPEARANCE_ACTIVITIES,
  getAppearanceBand,
} from "./appearance-rules.js";
import { getIllnessStage } from "./hospital.js";
import {
  NO_SLOT_LABEL,
  applyActivityGain,
  describeActivityRoom,
  getActivitySlotsLeft,
  previewActivityGain,
  useActivitySlot,
} from "../core/stat-budget.js";

export const packageTiers = [
  { id: "basic", label: "Cơ bản", price: 300_000, gain: 1 },
  { id: "standard", label: "Tiêu chuẩn", price: 1_200_000, gain: 3 },
  { id: "premium", label: "Cao cấp", price: 4_000_000, gain: 6 },
];

export const PASS_YEARS = 3;
export const PASS_PRICE_RATE = 0.85;
export const getPassPrice = (tier) =>
  Math.round(tier.price * PASS_YEARS * PASS_PRICE_RATE);
export const getActivePass = (player, id) => {
  const pass = player.developmentPasses?.[id];
  return pass &&
    pass.until >= player.age &&
    packageTiers.some((tier) => tier.id === pass.tier)
    ? pass
    : null;
};

export function collectDevelopmentPassesYear(player, age) {
  const passes = player.developmentPasses ?? {};
  const lines = [];
  const realAge = player.age;
  for (const [id, pass] of Object.entries(passes)) {
    const activity = developmentActivities.find((entry) => entry.id === id);
    const tier = packageTiers.find((entry) => entry.id === pass.tier);
    if (!activity || !tier || pass.until < age) {
      delete passes[id];
      if (activity)
        lines.push(
          `🎟️ Gói ${activity.name} đã hết hạn. Vào Phát triển bản thân để gia hạn nếu muốn tiếp tục.`,
        );
      continue;
    }
    if (player.isAlive === false) continue;
    player.age = age;
    try {
      if (hasTrainedThisYear(player, id) || !useActivitySlot(player)) continue;
      const { gain } = getTrainingGain(player, activity, tier.gain);
      const gained = applyActivityGain(player, activity.stat, gain);
      player.developmentDone = { ...(player.developmentDone ?? {}), [id]: age };
      lines.push(
        `${activity.icon} ${activity.name} (gói ${tier.label}, tự tham gia)${gained ? `: ${statName(activity.stat)} +${gained}` : ""}. Còn ${pass.until - age} năm.`,
      );
    } finally {
      player.age = realAge;
    }
  }
  return lines.length ? { content: lines.join("\n") } : null;
}

export const developmentStats = [
  { id: "health", icon: "💪", name: "Sức khỏe" },
  { id: "intelligence", icon: "🧠", name: "Trí tuệ" },
  { id: "happiness", icon: "❤️", name: "Hạnh phúc" },
  { id: "appearance", icon: "✨", name: "Ngoại hình" },
];

export const developmentActivities = [
  {
    id: "gym",
    stat: "health",
    icon: "🏋️",
    name: "Tập gym",
    description: "",
    packages: [
      "Vé tập 1 tháng",
      "Thẻ 6 tháng kèm huấn luyện viên",
      "Thẻ VIP 1 năm, huấn luyện viên riêng",
    ],
  },
  {
    id: "yoga",
    stat: "health",
    icon: "🧘",
    name: "Học yoga",
    description: "",
    packages: [
      "Lớp nhóm buổi tối",
      "Khóa yoga 3 tháng",
      "Khóa tu tập yoga trên núi",
    ],
  },
  {
    id: "language",
    stat: "intelligence",
    icon: "🗣️",
    name: "Học ngoại ngữ",
    description: "Thêm một ngôn ngữ là thêm một cánh cửa nhìn ra thế giới.",
    packages: [
      "Ứng dụng học trực tuyến",
      "Lớp tại trung tâm",
      "Gia sư bản xứ 1 kèm 1",
    ],
  },
  {
    id: "chess",
    stat: "intelligence",
    icon: "♟️",
    name: "Câu lạc bộ cờ vua",
    description: "Tính trước nhiều nước đi, đầu óc nhanh nhạy hơn mỗi ngày.",
    packages: [
      "Sinh hoạt câu lạc bộ",
      "Khóa học với kiện tướng",
      "Trại huấn luyện cờ chuyên sâu",
    ],
  },
  {
    id: "painting",
    stat: "happiness",
    icon: "🎨",
    name: "Lớp vẽ tranh",
    description: "Thả hồn vào màu sắc, quên đi những lo toan thường ngày.",
    packages: ["Buổi vẽ thử", "Khóa vẽ màu nước", "Workshop cùng họa sĩ"],
  },
  {
    id: "meditation",
    stat: "happiness",
    icon: "🕯️",
    name: "Thiền và chữa lành",
    description: "Lắng lại một chút để nghe xem lòng mình đang cần gì.",
    packages: [
      "Buổi thiền nhóm",
      "Khóa thiền chánh niệm",
      "Kỳ nghỉ chữa lành 7 ngày",
    ],
  },
  {
    id: "salon",
    stat: "appearance",
    icon: "💇",
    name: "Salon làm tóc",
    description: "Một kiểu tóc hợp dáng mặt, soi gương là thấy tự tin.",
    packages: [
      "Cắt gội tạo kiểu",
      "Cắt, nhuộm và phục hồi tóc",
      "Stylist riêng tạo hình trọn gói",
    ],
  },
  {
    id: "spa",
    stat: "appearance",
    icon: "🧖",
    name: "Spa chăm sóc da",
    description: "Làn da được chăm kỹ, gương mặt tươi tắn hẳn lên.",
    packages: [
      "Đắp mặt nạ thư giãn",
      "Liệu trình 5 buổi",
      "Liệu trình cao cấp trọn gói",
    ],
  },
];

const statName = (id) => developmentStats.find((stat) => stat.id === id).name;
export const hasTrainedThisYear = (player, id) =>
  (player.developmentDone?.[id] ?? -1) === player.age;

const hasSeriousIllness = (player) =>
  (player.illnesses ?? []).some(
    (illness) => getIllnessStage(illness, player.age, player.health) !== "mild",
  );

export const HIGH_STAT_THRESHOLD = 80;
export function getTrainingGain(player, activity, tierGain) {
  const high = (player[activity.stat] ?? 0) >= HIGH_STAT_THRESHOLD;
  if (
    activity.stat === "intelligence" &&
    getIntellectBand(player.intelligence).id === "sharp"
  ) {
    return {
      gain: Math.max(1, Math.ceil(tierGain * HIGH_INTELLECT_TRAINING_RATE)),
      note: "📈 Trí tuệ đã cao: học thêm vẫn có ích nhưng tăng chậm hơn (một nửa).",
    };
  }
  if (
    high &&
    !(activity.stat === "health" && isWeakForTraining(player.health))
  ) {
    return {
      gain: Math.max(1, Math.ceil(tierGain * HIGH_INTELLECT_TRAINING_RATE)),
      note: `📈 ${statName(activity.stat)} đã từ ${HIGH_STAT_THRESHOLD}: vẫn có ích nhưng tăng chậm hơn (một nửa).`,
    };
  }
  if (activity.stat !== "health") return { gain: tierGain };
  if (
    HEAVY_TRAINING.ids.includes(activity.id) &&
    (isWeakForTraining(player.health) || hasSeriousIllness(player))
  ) {
    return {
      gain: Math.max(1, Math.ceil(tierGain * HEAVY_TRAINING.weakRate)),
      note: "⚠️ Cơ thể đang yếu hoặc bệnh nặng: tập nặng dễ quá sức, hiệu quả chỉ còn một nửa. Nên chọn yoga, đi bộ nhẹ hoặc nghỉ ngơi.",
    };
  }
  if (
    LIGHT_TRAINING.ids.includes(activity.id) &&
    isWeakForTraining(player.health)
  ) {
    return {
      gain: tierGain + LIGHT_TRAINING.weakBonus,
      note: `🌿 Đang yếu: tập nhẹ giúp hồi phục, được thêm ${LIGHT_TRAINING.weakBonus} điểm.`,
    };
  }
  return { gain: tierGain };
}

export const freeActivities = {
  health: RECOVERY_ACTIVITIES.map((activity) => ({
    stat: "health",
    ...activity,
  })),
  happiness: MOOD_ACTIVITIES,
  intelligence: INTELLECT_ACTIVITIES,
  appearance: APPEARANCE_ACTIVITIES,
};
const bandOf = {
  health: getHealthBand,
  happiness: getHappinessBand,
  intelligence: getIntellectBand,
  appearance: getAppearanceBand,
};
export const getRecoveryGain = (player, activity) => {
  const stat = activity.stat ?? "health";
  return activity.gain[bandOf[stat](player[stat]).id];
};

export function initSelfDevelopment(
  state,
  { renderMoney, renderStats, renderLogEntry },
) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("self-development-dialog");
  const body = $("self-development-body");

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text, onClick) => {
    const node = element("button", className, text);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  };
  const focusFirst = () =>
    (
      body.querySelector(
        ".shop-group:not(:disabled), .dev-buy:not(:disabled)",
      ) ?? body.querySelector("button")
    )?.focus({ preventScroll: true });

  function buffNote() {
    const buff = getActiveTarotBuff(state.player);
    if (buff?.type === "wands")
      return element(
        "p",
        "tarot-buff",
        "🪄 Lá Gậy: lần tập tiếp theo được thêm 1 điểm vào chỉ số chính.",
      );
    if (buff?.type === "pentacles")
      return element(
        "p",
        "tarot-buff",
        `🪙 Lá Tiền: lần tập tiếp theo được giảm 10% phí, tối đa ${formatMoney(TAROT_DISCOUNT_MAX)}.`,
      );
    return null;
  }

  function train(activity, tier, statId, mode = "single") {
    const player = state.player;
    const prepaid = mode === "prepaid";
    const price = mode === "pass" ? getPassPrice(tier) : tier.price;
    const { fee: fullFee, discount: fullDiscount } = getTarotDiscountedFee(
      player,
      price,
    );
    const fee = prepaid ? 0 : fullFee;
    const discount = prepaid ? 0 : fullDiscount;
    if (
      (prepaid && !getActivePass(player, activity.id)) ||
      player.isAlive === false ||
      player.money < fee ||
      hasTrainedThisYear(player, activity.id) ||
      !useActivitySlot(player)
    )
      return;
    const bonus = getTarotStatBonus(player);
    const { gain } = getTrainingGain(player, activity, tier.gain);
    player.money -= fee;
    player.developmentDone = {
      ...(player.developmentDone ?? {}),
      [activity.id]: player.age,
    };
    if (mode === "pass")
      player.developmentPasses = {
        ...(player.developmentPasses ?? {}),
        [activity.id]: { tier: tier.id, until: player.age + PASS_YEARS - 1 },
      };
    if (discount) consumeTarotBuff(player, "pentacles");
    if (bonus) consumeTarotBuff(player, "wands");
    const gained = applyActivityGain(player, activity.stat, gain + bonus);
    const label = prepaid
      ? " (gói trả trước)"
      : mode === "pass"
        ? ` (gói ${PASS_YEARS} năm)`
        : "";
    const content =
      `${activity.icon} ${activity.name} (${activity.packages[packageTiers.indexOf(tier)]})${label}: ` +
      `Tiền -${formatMoneyAmount(fee)} VNĐ${gained ? ` · ${statName(activity.stat)} +${gained}` : ""}` +
      `${bonus ? " (có lá Gậy hỗ trợ)" : ""}${discount ? ` (lá Tiền giảm ${formatMoneyAmount(discount)} VNĐ)` : ""}.`;
    const log = { age: player.age, content, summary: content };
    state.logs.push(log);
    saveGame(state);
    renderMoney();
    renderStats();
    renderLogEntry(log);
    renderStat(statId, activity.id);
  }

  function recover(activity) {
    const player = state.player;
    if (
      player.isAlive === false ||
      hasTrainedThisYear(player, activity.id) ||
      !useActivitySlot(player)
    )
      return;
    const stat = activity.stat ?? "health";
    const gained = applyActivityGain(
      player,
      stat,
      getRecoveryGain(player, activity),
    );
    player.developmentDone = {
      ...(player.developmentDone ?? {}),
      [activity.id]: player.age,
    };
    const extras = [];
    if (activity.together) {
      if (applyActivityGain(player, "happiness", 1))
        extras.push("Hạnh phúc +1");
      if (player.partner) {
        player.partner = {
          ...player.partner,
          relationship: Math.min(100, (player.partner.relationship ?? 80) + 1),
        };
        extras.push(`gắn kết với ${player.partner.name} +1%`);
      }
    }
    if (activity.once) player.styleSkill = true;
    if (activity.needsJob) {
      player.workMerit = Math.min(
        PROMOTION.maxMerit,
        (player.workMerit ?? 0) + 1,
      );
      extras.push("thêm kinh nghiệm cho lần xét nâng bậc");
    }
    const content =
      `${activity.icon} ${activity.name} (miễn phí)${gained ? `: ${statName(stat)} +${gained}` : ""}` +
      `${extras.length ? ` · ${extras.join(" · ")}` : ""}.`;
    const log = { age: player.age, content, summary: content };
    state.logs.push(log);
    saveGame(state);
    renderStats();
    renderLogEntry(log);
    renderStat(stat, activity.id);
  }

  function recoveryCard(statId) {
    const player = state.player;
    const stat = developmentStats.find((entry) => entry.id === statId);
    const card = element("section", "dialog-card dev-activity dev-recovery");
    card.append(
      element(
        "h3",
        "",
        {
          health: "🌱 Hồi phục miễn phí",
          happiness: "🌱 Hồi phục tinh thần miễn phí",
          intelligence: "📚 Học miễn phí",
          appearance: "🪞 Chăm sóc cá nhân miễn phí",
        }[statId],
      ),
      element("p", "side-job-intro", statId === "intelligence" ? "" : ``),
    );
    const list = element("div", "dev-packages");
    for (const activity of freeActivities[statId]) {
      const done = hasTrainedThisYear(player, activity.id);
      const row = element("div", "dev-package");
      const info = element("div", "dev-package-info");
      info.append(
        element("strong", "", `${activity.icon} ${activity.name}`),
        element(
          "span",
          "shop-figures",
          `${activity.description} · ${stat.icon} ${stat.name} +${previewActivityGain(player, statId, getRecoveryGain(player, activity))}`,
        ),
      );
      const free = getActivitySlotsLeft(player) > 0;
      const action = button(
        "shop-buy dev-recover",
        done ? "Đã làm năm nay" : free ? "Thực hiện" : NO_SLOT_LABEL,
        () => recover(activity),
      );
      action.dataset.activity = activity.id;
      const needsJob =
        activity.needsJob && player.employmentStatus !== "employed";
      const learned = activity.once && player.styleSkill;
      if (needsJob) action.textContent = "Cần có việc chính";
      if (learned) action.textContent = "Đã có phong cách riêng";
      action.disabled =
        done ||
        !free ||
        needsJob ||
        learned ||
        player.isAlive === false ||
        (player[statId] >= 100 && !activity.once);
      row.append(info, action);
      list.append(row);
    }
    card.append(list);
    return card;
  }

  function renderHome() {
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const intro = element(
      "p",
      "game-motto",
      `Chọn chỉ số muốn rèn luyện. ${describeActivityRoom(state.player)}`,
    );
    const picker = element("div", "shop-groups");
    for (const stat of developmentStats) {
      const group = button(
        "shop-group",
        `${stat.icon} ${stat.name} — ${state.player[stat.id]}%`,
        () => renderStat(stat.id),
      );
      group.dataset.stat = stat.id;
      picker.append(group);
    }
    body.replaceChildren(...[back, intro, buffNote(), picker].filter(Boolean));
    focusFirst();
  }

  function renderStat(statId, justTrained = null) {
    const player = state.player;

    const realGain = (gain) => previewActivityGain(player, statId, gain);
    const stat = developmentStats.find((entry) => entry.id === statId);
    const back = button("shop-back", "← Chọn chỉ số khác", renderHome);
    const nodes = [
      back,
      element(
        "p",
        "shop-wallet",
        `Ví hiện có: ${formatMoney(player.money)} · ${stat.icon} ${stat.name}: ${player[statId]}%`,
      ),
      element("p", "side-job-intro", describeActivityRoom(player, [statId])),
    ];
    const note = buffNote();
    if (note) nodes.push(note);
    if (statId === "health") {
      if ((player.illnesses ?? []).length) {
        nodes.push(
          element(
            "p",
            "side-job-health-warning",
            "🩺 Tập luyện giúp khỏe hơn nhưng không chữa được bệnh. Hãy vào Bệnh viện để điều trị.",
          ),
        );
      }
    }
    if (freeActivities[statId]) nodes.push(recoveryCard(statId));
    for (const activity of developmentActivities.filter(
      (entry) => entry.stat === statId,
    )) {
      const done = hasTrainedThisYear(player, activity.id);
      const card = element(
        "section",
        `dialog-card dev-activity${activity.id === justTrained ? " is-trained" : ""}`,
      );
      card.dataset.activity = activity.id;
      card.append(
        element("h3", "", `${activity.icon} ${activity.name}`),
        element("p", "side-job-intro", activity.description),
      );
      if (done)
        card.append(
          element("p", "dev-done", "✅ Đã tham gia năm nay. Hẹn bạn năm sau!"),
        );
      const training = getTrainingGain(player, activity, 0);
      if (training.note)
        card.append(
          element(
            "p",
            "side-job-health-warning dev-health-note",
            training.note,
          ),
        );
      const list = element("div", "dev-packages");
      const pass = getActivePass(player, activity.id);
      if (pass) {
        const passTier = packageTiers.find((tier) => tier.id === pass.tier);
        const passIndex = packageTiers.indexOf(passTier);
        const row = element("div", "dev-package dev-pass");
        const info = element("div", "dev-package-info");
        const gain = realGain(
          getTrainingGain(player, activity, passTier.gain).gain +
            getTarotStatBonus(player),
        );
        info.append(
          element(
            "strong",
            "",
            `🎟️ Gói ${passTier.label}: ${activity.packages[passIndex]}`,
          ),
          element(
            "span",
            "shop-figures",
            `Đã trả trước, còn ${pass.until - player.age + 1} năm (kể cả năm nay) · mỗi năm tự tham gia · ✨ ${stat.name} +${gain}/năm`,
          ),
        );
        const free = getActivitySlotsLeft(player) > 0;
        const action = button(
          "shop-buy dev-buy dev-use-pass",
          done ? "Đã tham gia" : !free ? NO_SLOT_LABEL : "Tham gia ngay",
          () => train(activity, passTier, statId, "prepaid"),
        );
        action.dataset.activity = activity.id;
        action.dataset.tier = passTier.id;
        action.disabled = done || !free || player.isAlive === false;
        row.append(info, action);
        list.append(row);
      }
      packageTiers.forEach((tier, index) => {
        if (pass) return;
        const { fee, discount } = getTarotDiscountedFee(player, tier.price);
        const bonus = getTarotStatBonus(player);
        const row = element("div", "dev-package");
        const info = element("div", "dev-package-info");
        info.append(
          element("strong", "", `${tier.label}: ${activity.packages[index]}`),
          element(
            "span",
            "shop-figures",
            `💰 ${formatMoney(fee)}${discount ? ` (giảm ${formatMoney(discount)})` : ""} · ✨ ${stat.name} +${realGain(getTrainingGain(player, activity, tier.gain).gain + bonus)}` +
              (player[statId] +
                getTrainingGain(player, activity, tier.gain).gain +
                bonus >
              100
                ? " (chạm mức 100)"
                : realGain(
                      getTrainingGain(player, activity, tier.gain).gain + bonus,
                    ) <
                    getTrainingGain(player, activity, tier.gain).gain + bonus
                  ? " (đã gần đủ mức tăng năm nay)"
                  : ""),
          ),
        );
        const free = getActivitySlotsLeft(player) > 0;
        const action = button(
          "shop-buy dev-buy",
          done
            ? "Đã tham gia"
            : !free
              ? NO_SLOT_LABEL
              : player.money < fee
                ? "Không đủ tiền"
                : "Đăng ký",
          () => train(activity, tier, statId),
        );
        action.dataset.activity = activity.id;
        action.dataset.tier = tier.id;
        action.disabled =
          done || !free || player.money < fee || player.isAlive === false;
        row.append(info, action);
        list.append(row);

        const passFee = getTarotDiscountedFee(player, getPassPrice(tier)).fee;
        const passRow = element("div", "dev-package dev-pass-offer");
        const passInfo = element("div", "dev-package-info");
        passInfo.append(
          element("strong", "", `🎟️ Gói ${PASS_YEARS} năm: ${tier.label}`),
          element(
            "span",
            "shop-figures",
            `💰 ${formatMoney(passFee)} trả một lần (rẻ hơn ${Math.round((1 - PASS_PRICE_RATE) * 100)}% so với mua lẻ ${PASS_YEARS} năm) · các năm sau tự tham gia, hết hạn mới cần gia hạn`,
          ),
        );
        const passAction = button(
          "shop-buy dev-buy dev-buy-pass",
          done
            ? "Đã tham gia"
            : !free
              ? NO_SLOT_LABEL
              : player.money < passFee
                ? "Không đủ tiền"
                : "Mua gói",
          () => train(activity, tier, statId, "pass"),
        );
        passAction.dataset.activity = activity.id;
        passAction.dataset.tier = `${tier.id}-pass`;
        passAction.disabled =
          done ||
          !free ||
          player.money < passFee ||
          player.isAlive === false;
        passRow.append(passInfo, passAction);
        list.append(passRow);
      });
      card.append(list);
      nodes.push(card);
    }
    body.replaceChildren(...nodes);
    focusFirst();
  }

  $("activity-self-development").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    dialog.showModal();
    renderHome();
  });
  $("close-self-development").addEventListener("click", () => dialog.close());
}
