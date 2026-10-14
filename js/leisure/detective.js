import { saveGame } from "../core/save-store.js";
import { recordAchievementFlags } from "../achievements/achievements-data.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { askConfirm } from "../ui/confirm-dialog.js";
import {
  DAY_END, DAY_START, DETECTIVE_MIN_AGE, EXTRA_HOUR_RATE, MAX_EXTRA_HOURS, SHARP_INTELLECT, UNPROVEN_RATE,
  WRONG_HAPPINESS, WRONG_REPUTATION, accuse, baseRewardOf, canInvestigate, clearingClue, describeClue, describeFact,
  describeMismatch, detectiveAchievementIds, detectiveOf, detectiveTiers, ensureBoard, formatClock, getDetectiveScene,
  getOfferBlocker, hoursLeft, investigate, nextRankOf, rankOf, sourceOf, takeOffer,
} from "./detective-data.js";

const AVATAR_COLORS = ["#e07a3f", "#2a9d8f", "#c0504d", "#5f9a48", "#4d7cc7", "#8e5bd6"];
const TABS = [
  { id: "file", icon: "📄", name: "Hồ sơ" },
  { id: "leads", icon: "🔎", name: "Điều tra" },
  { id: "people", icon: "👥", name: "Nghi phạm" },
];
const percent = (rate) => `${Math.round(rate * 100)}%`;
const lower = (text) => text.toLocaleLowerCase("vi-VN");

export function initDetective(state, { renderMoney, renderStats, renderLogEntry, checkAchievements }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("detective-dialog");
  const body = $("detective-body");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTab = "file";
  // Lập luận đang soạn (chưa lưu): người bị chỉ ra và manh mối loại trừ từng người còn lại.
  let draft = null;

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
  const save = () => saveGame(state);
  const currentFile = () => state.player.detective?.current ?? null;
  const focusFirst = (selector) => (body.querySelector(selector ?? ".detective-primary:not(:disabled)")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });
  const show = (...nodes) => {
    body.replaceChildren(...nodes);
    dialog.scrollTop = 0;
  };

  function avatar(suspect, index, size = "") {
    const node = element("span", `detective-avatar ${size}`, suspect.name.charAt(0));
    node.style.setProperty("--avatar", AVATAR_COLORS[index % AVATAR_COLORS.length]);
    node.setAttribute("aria-hidden", "true");
    return node;
  }
  const clueTag = (file, clueIndex) =>
    `${sourceOf(file.clues[clueIndex]).chip} #${file.revealed.indexOf(clueIndex) + 1}`;
  function tierBadge(tier) {
    return element("span", `detective-tier-badge tier-${tier.id}`, `${tier.icon} ${tier.name}`);
  }

  // ---------- Văn phòng và bảng hồ sơ ----------
  function renderHome() {
    const player = state.player;
    const detective = detectiveOf(player);
    if (ensureBoard(player)) save();
    const rank = rankOf(detective.reputation);
    const next = nextRankOf(detective.reputation);

    const office = element("section", "detective-office");
    const progress = element("div", "detective-progress");
    const fill = element("span");
    fill.style.width = percent(next ? (detective.reputation - rank.min) / (next.min - rank.min) : 1);
    progress.append(fill);
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-label", "Danh tiếng");
    progress.setAttribute("aria-valuenow", String(detective.reputation));
    const info = element("div", "detective-office-info");
    info.append(element("p", "detective-rank", rank.name), progress,
      element("p", "detective-progress-label", next
        ? `Danh tiếng ${detective.reputation} · còn ${next.min - detective.reputation} để thành ${next.name}`
        : `Danh tiếng ${detective.reputation} · Bậc cao nhất`));
    office.append(element("span", "detective-office-badge", "🕵️"), info);

    const stats = element("div", "detective-stats");
    for (const [icon, value, label] of [["🗂️", detective.solved, "Vụ đã phá"], ["🎯", detective.streak, "Chuỗi trọn vẹn"], ["⚠️", detective.failed, "Kết luận sai"]]) {
      const tile = element("div", "detective-stat");
      tile.append(element("span", "detective-stat-value", `${icon} ${value}`), element("span", "detective-stat-label", label));
      stats.append(tile);
    }

    const nodes = [button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    }), office, stats];
    const file = currentFile();
    if (file) {
      const scene = getDetectiveScene(file.scene);
      nodes.push(button("shop-buy detective-primary detective-resume", `📂 Tiếp tục hồ sơ: ${scene.title}`, render));
    }
    nodes.push(element("h3", "detective-section-title", `📌 Bảng hồ sơ năm ${player.age} tuổi`));
    if (player.age < DETECTIVE_MIN_AGE) {
      nodes.push(element("p", "license-age-note", `🔞 Cần đủ ${DETECTIVE_MIN_AGE} tuổi để nhận vụ việc. Còn ${DETECTIVE_MIN_AGE - player.age} năm nữa.`));
    } else {
      const board = element("div", "detective-board");
      detective.board.offers.forEach((offer, index) => board.append(offerCard(offer, index)));
      nodes.push(board, element("p", "detective-panel-note", "Sang tuổi mới, bảng sẽ có hồ sơ mới. Danh tiếng càng cao, khách tìm đến với vụ càng lớn."));
    }
    nodes.push(rulesCard());
    show(...nodes);
    focusFirst(".detective-resume, .detective-take:not(:disabled)");
  }

  function offerCard(offer, index) {
    const tier = detectiveTiers[offer.file.tier];
    const scene = getDetectiveScene(offer.file.scene);
    const card = element("article", `detective-offer tier-${tier.id}${offer.taken ? " is-taken" : ""}`);
    const top = element("div", "detective-offer-top");
    top.append(tierBadge(tier), element("span", "detective-offer-reward", formatMoney(tier.reward)));
    card.append(element("span", "detective-pin"), top,
      element("h4", "", `${scene.icon} ${scene.title}`),
      element("p", "detective-offer-client", `Người nhờ: ${scene.client}`),
      element("p", "detective-offer-meta", `👥 ${offer.file.suspects.length} người · ⏳ ${tier.hours} giờ điều tra`));
    if (offer.taken) {
      card.append(element("span", "detective-offer-stamp", "ĐÃ NHẬN"));
    } else {
      const take = button("shop-buy detective-take", "Nhận hồ sơ", () => {
        if (!takeOffer(state.player, index)) return;
        activeTab = "file";
        draft = null;
        save();
        renderCase();
      });
      const blocker = getOfferBlocker(state.player, index);
      take.disabled = Boolean(blocker);
      if (blocker) take.title = blocker;
      card.append(take);
    }
    return card;
  }

  function rulesCard() {
    const rules = element("details", "dialog-card detective-rules");
    const steps = element("ul");
    for (const line of [
      "Mỗi năm có 3 hồ sơ trên bảng. Nhận một hồ sơ, khép lại rồi mới nhận hồ sơ khác.",
      "Manh mối không có sẵn: mỗi nguồn điều tra tốn 1 giờ và cho một manh mối về người cần tìm. Hãy xem thẻ nghi phạm trước để chọn nguồn giúp loại được nhiều người nhất.",
      `Hết giờ vẫn điều tra thêm được, mỗi giờ thêm làm thù lao giảm ${percent(EXTRA_HOUR_RATE)}, tối đa ${MAX_EXTRA_HOURS} giờ. Trí tuệ từ ${SHARP_INTELLECT} có thêm 1 giờ mỗi vụ.`,
      "Có mặt vào bất kỳ lúc nào trong khoảng xảy ra việc thì chưa loại được người đó.",
      `Khi chỉ ra một người, bạn phải nêu manh mối cho thấy từng người còn lại vô can. Mỗi người chưa loại được bằng căn cứ đúng làm thù lao giảm ${percent(UNPROVEN_RATE)}.`,
      `Chứng minh trọn vẹn: đủ thù lao, tăng danh tiếng, Trí tuệ +1. Chỉ sai người: không có thù lao, danh tiếng −${WRONG_REPUTATION}, Hạnh phúc −${WRONG_HAPPINESS}.`,
      "Danh tiếng 4 mở vụ vừa, danh tiếng 10 mở vụ khó.",
    ]) steps.append(element("li", "", line));
    rules.append(element("summary", "", "📖 Cách làm việc"), steps);
    return rules;
  }

  // ---------- Hồ sơ đang mở ----------
  function caseHeader(file) {
    const tier = detectiveTiers[file.tier];
    const scene = getDetectiveScene(file.scene);
    const head = element("header", "detective-case-head");
    const title = element("div", "detective-case-title");
    const titleText = element("div");
    const sub = element("p", "detective-case-client");
    sub.append(tierBadge(tier), document.createTextNode(` Người nhờ: ${scene.client}`));
    titleText.append(element("h3", "", scene.title), sub);
    title.append(element("span", "detective-case-icon", scene.icon), titleText);

    const meters = element("div", "detective-meters");
    const hours = element("div", "detective-meter");
    const dots = element("span", "detective-hours");
    const used = Math.min(file.revealed.length, file.hours);
    for (let slot = 0; slot < file.hours; slot++) dots.append(element("span", `detective-hour${slot < used ? " is-used" : ""}`));
    for (let slot = 0; slot < file.extraHours; slot++) dots.append(element("span", "detective-hour is-extra"));
    hours.append(element("span", "detective-meter-label", "⏳ Giờ điều tra"), dots,
      element("span", "detective-meter-value", `Còn ${hoursLeft(file)} giờ`));
    const reward = element("div", "detective-meter");
    reward.append(element("span", "detective-meter-label", "💰 Thù lao tối đa"),
      element("span", "detective-meter-value is-money", formatMoney(baseRewardOf(file))));
    meters.append(hours, reward);
    head.append(title, meters);
    return head;
  }

  // scroll: "top" khi mở hồ sơ, "keep" khi điều tra/đánh dấu, "tabs" khi đổi tab (giữ thanh tab trong tầm nhìn).
  function renderCase(focusSelector, scroll = "top") {
    const file = currentFile();
    const tabs = element("div", "detective-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Hồ sơ vụ việc");
    const counts = { leads: `${file.revealed.length}/${file.clues.length}`, people: String(file.suspects.length - file.crossed.length) };
    for (const tab of TABS) {
      const node = button("detective-tab", "", () => {
        activeTab = tab.id;
        renderCase(`#detective-tab-${tab.id}`, "tabs");
      });
      node.id = `detective-tab-${tab.id}`;
      node.setAttribute("role", "tab");
      node.setAttribute("aria-selected", String(activeTab === tab.id));
      node.setAttribute("aria-controls", "detective-panel");
      node.tabIndex = activeTab === tab.id ? 0 : -1;
      node.append(element("span", "detective-tab-icon", tab.icon), element("span", "", tab.name));
      if (counts[tab.id]) node.append(element("span", "detective-tab-count", counts[tab.id]));
      tabs.append(node);
    }
    tabs.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = TABS.findIndex((tab) => tab.id === activeTab);
      activeTab = TABS[(index + step + TABS.length) % TABS.length].id;
      renderCase(`#detective-tab-${activeTab}`, "tabs");
    });
    const panel = element("section", "detective-panel");
    panel.id = "detective-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `detective-tab-${activeTab}`);
    panel.append(...({ file: filePanel, leads: leadsPanel, people: peoplePanel }[activeTab])(file));

    const drop = button("shop-back detective-drop", "Trả lại hồ sơ", () => askConfirm("Trả lại hồ sơ?",
      "Bạn sẽ không nhận thù lao, và hồ sơ này không quay lại bảng trong năm nay. Danh tiếng không thay đổi.",
      "Trả lại hồ sơ", () => {
        state.player.detective.current = null;
        draft = null;
        save();
        renderHome();
      }));
    const scrollTop = dialog.scrollTop;
    body.replaceChildren(button("shop-back", "← Văn phòng", renderHome), caseHeader(file), tabs, panel, drop);
    dialog.scrollTop = scroll === "keep" ? scrollTop : scroll === "tabs" ? Math.min(scrollTop, tabs.offsetTop - 8) : 0;
    if (focusSelector) body.querySelector(focusSelector)?.focus({ preventScroll: true });
  }

  function filePanel(file) {
    const scene = getDetectiveScene(file.scene);
    const paper = element("div", "detective-paper");
    paper.append(element("p", "", scene.intro(file.suspects.length)));
    return [paper, timeline(file)];
  }

  function timeline(file) {
    const known = file.revealed.includes(file.clues.findIndex((clue) => clue.type === "time"));
    const span = DAY_END - DAY_START;
    const at = (minute) => `${((minute - DAY_START) / span) * 100}%`;
    const section = element("section", "detective-timeline");
    section.append(element("h4", "", "🕒 Dòng thời gian buổi chiều"));
    const axis = element("div", "detective-tl-row detective-tl-axis");
    const ticks = element("div", "detective-tl-track");
    for (let minute = DAY_START; minute <= DAY_END; minute += 60) {
      const tick = element("span", "detective-tl-tick", formatClock(minute));
      tick.style.left = at(minute);
      ticks.append(tick);
    }
    axis.append(element("span"), ticks);
    section.append(axis);
    file.suspects.forEach((suspect, index) => {
      const row = element("div", `detective-tl-row${file.crossed.includes(index) ? " is-crossed" : ""}`);
      const name = element("span", "detective-tl-name");
      name.append(avatar(suspect, index, "is-tiny"), document.createTextNode(suspect.name));
      const track = element("div", "detective-tl-track");
      if (known) {
        const band = element("span", "detective-tl-band");
        band.style.left = at(file.window[0]);
        band.style.width = `${((file.window[1] - file.window[0]) / span) * 100}%`;
        track.append(band);
      }
      const bar = element("span", "detective-tl-bar");
      bar.style.left = at(suspect.arrive);
      bar.style.width = `${((suspect.leave - suspect.arrive) / span) * 100}%`;
      bar.style.setProperty("--avatar", AVATAR_COLORS[index % AVATAR_COLORS.length]);
      bar.title = `${suspect.name}: ${formatClock(suspect.arrive)}–${formatClock(suspect.leave)}`;
      track.append(bar);
      row.append(name, track);
      section.append(row);
    });
    section.append(element("p", "detective-panel-note", known
      ? `Vùng tô đỏ ${formatClock(file.window[0])}–${formatClock(file.window[1])} là lúc việc xảy ra.`
      : "Chưa rõ việc xảy ra lúc nào. Điều tra nguồn “Dựng mốc thời gian” để đánh dấu lên dòng thời gian."));
    return section;
  }

  function leadsPanel(file) {
    const left = hoursLeft(file);
    const note = element("p", "detective-panel-note", left
      ? `Mỗi nguồn tốn 1 giờ, bạn còn ${left} giờ. Hãy xem thẻ nghi phạm để chọn nguồn giúp loại được nhiều người nhất.`
      : `Đã hết giờ được giao. Điều tra thêm vẫn được, nhưng mỗi giờ thêm làm thù lao giảm ${percent(EXTRA_HOUR_RATE)}.`);
    const nodes = [note];
    if (file.sharp) nodes.push(element("p", "detective-sharp", `🧠 Trí tuệ nhạy bén giúp bạn có thêm 1 giờ điều tra trong vụ này.`));
    const list = element("div", "detective-leads");
    file.clues.forEach((clue, index) => {
      const source = sourceOf(clue);
      const revealed = file.revealed.includes(index);
      const card = element("article", `detective-lead${revealed ? " is-revealed" : ""}`);
      card.dataset.lead = index;
      if (revealed) card.tabIndex = -1;
      const text = element("div", "detective-lead-text");
      text.append(element("h4", "", source.label), element("p", "detective-lead-tells", `Cho biết: ${lower(source.tells)}`));
      if (revealed) {
        const found = element("p", "detective-clue");
        found.append(element("span", "detective-clue-tag", clueTag(file, index)), document.createTextNode(describeClue(file, clue)));
        text.append(found);
      } else {
        const extra = left === 0;
        const action = button(`shop-buy detective-investigate${extra ? " is-extra" : ""}`,
          !canInvestigate(file, index) ? "Hết giờ điều tra" : extra ? `Điều tra thêm · −${percent(EXTRA_HOUR_RATE)} thù lao` : "Điều tra · 1 giờ",
          () => {
            const run = () => {
              if (!investigate(state.player, index)) return;
              save();
              renderCase(`[data-lead="${index}"]`, "keep");
              const fresh = body.querySelector(`[data-lead="${index}"]`);
              if (!reducedMotion.matches) fresh?.animate([{ background: "#fff3b0" }, { background: "#fffdf6" }], { duration: 900, easing: "ease-out" });
            };
            if (!extra) run();
            else askConfirm("Điều tra thêm?", `Bạn đã dùng hết giờ được giao. Điều tra thêm nguồn này làm thù lao giảm ${percent(EXTRA_HOUR_RATE)}.`, "Điều tra thêm", run);
          });
        action.disabled = !canInvestigate(file, index);
        text.append(action);
      }
      card.append(element("span", "detective-lead-icon", source.icon), text);
      list.append(card);
    });
    nodes.push(list);
    return nodes;
  }

  function suspectFacts(file, suspect) {
    const facts = element("ul", "detective-facts");
    facts.append(element("li", "", `🕒 ${formatClock(suspect.arrive)}–${formatClock(suspect.leave)}`));
    for (const attr of Object.keys(suspect.attrs)) {
      facts.append(element("li", "", `${sourceOf({ attr }).chip} ${describeFact(suspect, attr)}`));
    }
    return facts;
  }

  function peoplePanel(file) {
    const grid = element("div", "detective-suspects");
    file.suspects.forEach((suspect, index) => {
      const crossed = file.crossed.includes(index);
      const card = element("article", `detective-suspect${crossed ? " is-crossed" : ""}`);
      card.dataset.suspect = index;
      const head = element("div", "detective-suspect-head");
      const who = element("div");
      who.append(element("h4", "", suspect.name), element("p", "detective-role", suspect.role));
      head.append(avatar(suspect, index), who);
      if (crossed) head.append(element("span", "detective-crossed-mark", "Vô can?"));
      const actions = element("div", "detective-actions");
      const cross = button("shop-back detective-cross", crossed ? "↺ Xem lại" : "✕ Loại trừ", () => {
        file.crossed = crossed ? file.crossed.filter((other) => other !== index) : [...file.crossed, index];
        save();
        renderCase(`[data-suspect="${index}"] .detective-cross`, "keep");
      });
      const point = button("shop-buy detective-accuse", "☝️ Chỉ ra", () => {
        if (draft?.accused !== index) draft = { accused: index, reasons: {} };
        renderConclusion();
      });
      actions.append(cross, point);
      card.append(head, suspectFacts(file, suspect), actions);
      grid.append(card);
    });
    return [element("p", "detective-panel-note", "Bấm ✕ Loại trừ để tự đánh dấu người bạn đã chắc vô can. Đánh dấu chỉ để ghi nhớ, không ảnh hưởng kết quả."), grid];
  }

  // ---------- Lập luận buộc tội ----------
  function renderConclusion() {
    const file = currentFile();
    const scene = getDetectiveScene(file.scene);
    const accused = file.suspects[draft.accused];
    const target = element("section", "detective-accused");
    const who = element("div");
    who.append(element("p", "detective-kicker", "Bạn định chỉ ra"), element("h3", "", `${accused.name} · ${accused.role}`),
      element("p", "", `là ${scene.taker}.`));
    target.append(avatar(accused, draft.accused, "is-large"), who);

    const clues = element("section", "dialog-card");
    clues.append(element("h3", "", "🗒️ Manh mối đã có"));
    if (file.revealed.length) {
      const list = element("ul", "detective-clue-list");
      for (const clueIndex of file.revealed) {
        const row = element("li");
        row.append(element("span", "detective-clue-tag", clueTag(file, clueIndex)), document.createTextNode(describeClue(file, file.clues[clueIndex])));
        list.append(row);
      }
      clues.append(list);
    } else {
      clues.append(element("p", "detective-panel-note", "Bạn chưa điều tra nguồn nào, nên chưa có căn cứ để loại ai."));
    }

    const reasoning = element("section", "dialog-card detective-reasoning");
    reasoning.append(element("h3", "", "🧩 Vì sao không phải những người còn lại?"),
      element("p", "detective-panel-note", `Với mỗi người, chọn manh mối cho thấy người đó vô can. Mỗi người chưa loại được bằng căn cứ đúng làm thù lao giảm ${percent(UNPROVEN_RATE)}.`));
    file.suspects.forEach((suspect, index) => {
      if (index === draft.accused) return;
      const row = element("div", "detective-reason-row");
      const name = element("div", "detective-reason-name");
      name.append(avatar(suspect, index, "is-tiny"), element("span", "", suspect.name));
      const options = element("div", "detective-reason-options");
      options.setAttribute("role", "group");
      options.setAttribute("aria-label", `Căn cứ loại ${suspect.name}`);
      const choices = [...file.revealed.map((clueIndex) => [clueIndex, clueTag(file, clueIndex)]), [null, "Chưa loại được"]];
      for (const [clueIndex, label] of choices) {
        const chip = button("detective-chip", label, () => {
          draft.reasons[index] = clueIndex;
          options.querySelectorAll(".detective-chip").forEach((other) => other.setAttribute("aria-pressed", String(other === chip)));
        });
        chip.setAttribute("aria-pressed", String((draft.reasons[index] ?? null) === clueIndex));
        options.append(chip);
      }
      row.append(name, options);
      reasoning.append(row);
    });

    const submit = button("shop-buy detective-primary detective-submit", "📝 Nộp kết luận", settle);
    show(button("shop-back", "← Quay lại hồ sơ", () => renderCase()), target, clues, reasoning,
      element("p", "detective-warning", `Nếu chỉ sai người: không có thù lao, danh tiếng −${WRONG_REPUTATION}, Hạnh phúc −${WRONG_HAPPINESS}.`),
      submit);
    focusFirst(".detective-chip");
  }

  function settle() {
    const file = currentFile();
    const result = accuse(state.player, draft.accused, draft.reasons);
    if (!result) return;
    draft = null;
    const scene = getDetectiveScene(file.scene);
    recordAchievementFlags(state, detectiveAchievementIds(state.player.detective, file));
    const pay = `Thù lao: Tiền +${formatMoneyAmount(result.reward)} VNĐ.`;
    const content = !result.correct
      ? `🕵️ Tôi nhận vụ “${scene.title}” nhưng kết luận vội, nghi oan cho một người vô can. Tôi không nhận được thù lao.` +
        (result.happiness ? ` Hạnh phúc ${result.happiness}.` : "")
      : result.unproven
        ? `🕵️ Tôi nhận vụ “${scene.title}” và chỉ ra đúng ${scene.taker}, nhưng lập luận còn thiếu căn cứ nên thù lao bị giảm. ${pay}`
        : `🕵️ Tôi nhận vụ “${scene.title}” và chứng minh trọn vẹn ai là ${scene.taker}. ${scene.outcome} ${pay}` +
          (result.intelligence ? ` Trí tuệ +${result.intelligence}.` : "");
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    save();
    renderMoney();
    renderStats();
    renderLogEntry(log);
    renderResult(true);
  }

  // ---------- Kết quả và lời giải ----------
  function renderResult(animate = false) {
    const file = currentFile();
    const { result } = file;
    const scene = getDetectiveScene(file.scene);
    const culprit = file.suspects[file.culprit];
    const accused = file.suspects[result.accused];
    const outcome = !result.correct ? "wrong" : result.unproven ? "partial" : "solved";
    const stamp = element("div", `detective-stamp is-${outcome}`, { solved: "ĐÃ PHÁ ÁN", partial: "THIẾU CĂN CỨ", wrong: "KẾT LUẬN SAI" }[outcome]);
    if (animate && !reducedMotion.matches) {
      stamp.animate([{ transform: "rotate(-8deg) scale(2.4)", opacity: 0 }, { transform: "rotate(-8deg) scale(0.92)", opacity: 1, offset: 0.7 },
        { transform: "rotate(-8deg) scale(1)", opacity: 1 }], { duration: 520, easing: "cubic-bezier(0.2, 0.9, 0.3, 1.2)" });
    }
    const story = {
      solved: `${culprit.name} không còn chối được khi bạn đặt từng manh mối cạnh nhau. ${scene.outcome}`,
      partial: `Bạn chỉ đúng ${culprit.name}, nhưng chưa chứng minh được ${result.unproven} người còn lại vô can. ${scene.client} vẫn trả thù lao, có điều bớt đi phần tương ứng. ${scene.outcome}`,
      wrong: `${accused.name} có đủ căn cứ cho thấy mình vô can. Người cần tìm là ${culprit.name} (${lower(culprit.role)}). ${scene.client} không trả thù lao, và chuyện kết luận vội vàng khiến người ta e dè khi tìm đến bạn.`,
    }[outcome];
    const changes = element("div", "detective-changes");
    const changeList = [
      result.reward ? [`💰 +${formatMoney(result.reward)}`, "is-good"] : null,
      result.reputation ? [`🏅 Danh tiếng ${result.reputation > 0 ? "+" : ""}${result.reputation}`, result.reputation > 0 ? "is-good" : "is-bad"] : null,
      result.intelligence ? [`🧠 Trí tuệ +${result.intelligence}`, "is-good"] : null,
      result.happiness ? [`💔 Hạnh phúc ${result.happiness}`, "is-bad"] : null,
    ].filter(Boolean);
    if (!changeList.length) changeList.push(["Không có thay đổi", ""]);
    for (const [text, tone] of changeList) changes.append(element("span", `detective-change ${tone}`, text));
    const summary = element("section", `dialog-card detective-result is-${outcome}`);
    summary.append(element("p", "", story), changes);

    const solution = element("section", "dialog-card");
    solution.append(element("h3", "", "🧩 Lời giải"));
    const rows = element("div", "detective-solution");
    file.suspects.forEach((suspect, index) => {
      const row = element("div", `detective-solution-row${index === file.culprit ? " is-culprit" : ""}`);
      const text = element("div");
      text.append(element("strong", "", `${suspect.name} · ${suspect.role}`));
      if (index === file.culprit) {
        text.append(element("p", "", `☝️ Người cần tìm: khớp với mọi manh mối.${index === result.accused ? "" : " Bạn đã bỏ sót người này."}`));
      } else {
        const clueIndex = clearingClue(file, index);
        text.append(element("p", "", `✕ Loại nhờ ${lower(sourceOf(file.clues[clueIndex]).label)}: ${describeMismatch(file, index, clueIndex)}.`));
        if (index === result.accused) text.append(element("p", "detective-verdict is-bad", "Bạn đã chỉ ra người này."));
        else if (result.correct) {
          text.append(element("p", `detective-verdict ${result.proofs[index] ? "is-good" : "is-bad"}`,
            result.proofs[index] ? "✓ Lập luận của bạn đúng." : "✗ Lập luận của bạn chưa loại được người này."));
        }
      }
      row.append(avatar(suspect, index), text);
      rows.append(row);
    });
    solution.append(rows);

    const all = element("section", "dialog-card");
    all.append(element("h3", "", "🗒️ Toàn bộ manh mối"));
    const list = element("ul", "detective-clue-list");
    file.clues.forEach((clue, index) => {
      const row = element("li", file.revealed.includes(index) ? "" : "is-hidden");
      row.append(element("span", "detective-clue-tag", sourceOf(clue).chip),
        document.createTextNode(`${describeClue(file, clue)}${file.revealed.includes(index) ? "" : " (chưa điều tra)"}`));
      list.append(row);
    });
    all.append(list);

    const done = button("shop-buy detective-primary", "Khép hồ sơ", () => {
      state.player.detective.current = null;
      save();
      renderHome();
    });
    show(stamp, summary, solution, all, done);
    focusFirst();
  }

  function render() {
    const file = currentFile();
    if (file?.result) renderResult();
    else if (file) renderCase();
    else renderHome();
  }

  $("activity-detective").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    render();
    dialog.showModal();
    focusFirst();
  });
  $("close-detective").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => checkAchievements?.());
}
