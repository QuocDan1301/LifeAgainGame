import { saveGame } from "../core/save-store.js";
import { recordAchievementFlags } from "../achievements/achievements-data.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { askConfirm } from "../ui/confirm-dialog.js";
import {
  NO_SLOT_LABEL,
  STAT_LABELS,
  describeActivitySlots,
  getActivitySlotsLeft,
  previewActivityGain,
} from "../core/stat-budget.js";
import {
  DILIGENT_CARE_BONUS,
  GARDEN_MIN_AGE,
  MAX_FERTILIZER,
  STARTER_SEEDS,
  advanceSeason,
  buy,
  buyPlot,
  canFertilize,
  canWaterPlot,
  careLeft,
  careMax,
  clearPlot,
  cook,
  cookRank,
  cookTiers,
  cookedTotal,
  cropOf,
  crops,
  dryCount,
  eat,
  fertilize,
  gardenAchievementIds,
  gardenOf,
  getCookBlocker,
  getDiligentBlocker,
  getPlantBlocker,
  groceries,
  harvest,
  hasEatenThisYear,
  ingredientOf,
  isDiligent,
  isReady,
  isResting,
  missingFor,
  plant,
  plotPrice,
  recipes,
  removePest,
  seasons,
  sell,
  sellPriceOf,
  waterPlot,
  weathers,
  workDiligently,
  yieldOf,
} from "./garden-data.js";

const TABS = [
  { id: "garden", icon: "🌱", name: "Vườn" },
  { id: "market", icon: "🛒", name: "Chợ" },
  { id: "kitchen", icon: "🍳", name: "Bếp" },
  { id: "pantry", icon: "🧺", name: "Kho" },
];
const lower = (text) => text.toLocaleLowerCase("vi-VN");
const capitalize = (text) =>
  text.charAt(0).toLocaleUpperCase("vi-VN") + text.slice(1);
const seasonList = (ids) => ids.map((id) => seasons[id].short).join(" · ");

export function initGarden(
  state,
  { renderMoney, renderStats, renderLogEntry, checkAchievements },
) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("garden-dialog");
  const body = $("garden-body");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTab = "garden";
  let selected = null;

  let marketView = "seeds";
  let kitchenTier = 0;

  let toast = null;
  let report = null;

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
  const player = () => state.player;
  const garden = () => gardenOf(state.player);
  const log = (content) => {
    const entry = { age: state.player.age, content, summary: content };
    state.logs.push(entry);
    renderLogEntry(entry);
  };

  function commit(message, focusSelector) {
    if (message) toast = message;
    recordAchievementFlags(state, gardenAchievementIds(garden()));
    saveGame(state);
    renderMoney();
    render({ keepScroll: true, focusSelector });
  }

  // ---------- Khung chung ----------
  function hero() {
    const g = garden();
    const resting = isResting(g);
    const season = seasons[Math.min(g.season, 3)];
    const weather = weathers[g.weather];
    const node = element(
      "section",
      `garden-hero season-${season.id}${resting ? " is-resting" : ` weather-${g.weather}`}`,
    );
    node.append(element("span", "garden-particles"));
    if (!resting && g.weather !== "fair")
      node.append(element("span", `garden-sky weather-${g.weather}`));
    const top = element("div", "garden-hero-top");
    const title = element("div", "garden-hero-title");
    title.append(
      element("span", "garden-hero-icon", resting ? "🛌" : season.icon),
      element("div", "", ""),
    );
    title.lastChild.append(
      element("p", "garden-kicker", `Năm ${player().age} tuổi`),
      element("h3", "", resting ? "Vườn nghỉ đông" : season.name),
    );
    top.append(
      title,
      element("span", "garden-wallet", `💰 ${formatMoney(player().money)}`),
    );
    const track = element("ol", "garden-season-track");
    seasons.forEach((item, index) => {
      const status =
        index < g.season ? "is-done" : index === g.season ? "is-now" : "";
      const step = element("li", status);
      step.append(
        element("span", "garden-season-dot", item.icon),
        element("span", "", item.short),
      );
      track.append(step);
    });
    const weatherChip = element(
      "p",
      "garden-weather",
      resting
        ? "Sang tuổi mới, mùa xuân sẽ trở lại. Cây đã chín vẫn thu hoạch được."
        : `${weather.icon} ${weather.name}: ${weather.note}`,
    );
    node.append(top, track, weatherChip);
    if (!resting) {
      const forecast = weathers[g.forecast];
      node.append(
        element(
          "p",
          "garden-forecast",
          forecast
            ? `📻 Dự báo ${lower(seasons[g.season + 1].name)}: ${forecast.icon} ${forecast.name}`
            : "📻 Sau mùa đông vườn nghỉ. Cây chưa chín được giữ trên luống tới mùa xuân năm sau.",
        ),
      );
    }
    return node;
  }

  function tabBar() {
    const g = garden();
    const counts = {
      garden: g.plots.filter((plot) => isReady(plot)).length,
      pantry: Object.values(g.dishes).reduce((sum, count) => sum + count, 0),
    };
    const tabs = element("div", "garden-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Vườn nhà");
    for (const tab of TABS) {
      const node = button("garden-tab", "", () => {
        activeTab = tab.id;
        toast = null;
        render({ tabs: true, focusSelector: `#garden-tab-${tab.id}` });
      });
      node.id = `garden-tab-${tab.id}`;
      node.setAttribute("role", "tab");
      node.setAttribute("aria-selected", String(activeTab === tab.id));
      node.setAttribute("aria-controls", "garden-panel");
      node.tabIndex = activeTab === tab.id ? 0 : -1;
      node.append(
        element("span", "garden-tab-icon", tab.icon),
        element("span", "", tab.name),
      );
      if (counts[tab.id])
        node.append(
          element("span", "garden-tab-count", String(counts[tab.id])),
        );
      tabs.append(node);
    }
    tabs.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = TABS.findIndex((tab) => tab.id === activeTab);
      activeTab = TABS[(index + step + TABS.length) % TABS.length].id;
      render({ tabs: true, focusSelector: `#garden-tab-${activeTab}` });
    });
    return tabs;
  }

  function render({ keepScroll = false, tabs = false, focusSelector } = {}) {
    const scrollTop = dialog.scrollTop;
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    if (player().age < GARDEN_MIN_AGE) {
      body.replaceChildren(
        back,
        element(
          "p",
          "license-age-note",
          `🌱 Cần đủ ${GARDEN_MIN_AGE} tuổi để tự chăm vườn.`,
        ),
      );
      return;
    }
    const panel = element("section", "garden-panel");
    panel.id = "garden-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `garden-tab-${activeTab}`);
    if (toast) {
      const note = element("p", "garden-toast", toast);
      note.setAttribute("role", "status");
      panel.append(note);
    }
    panel.append(
      ...{
        garden: gardenPanel,
        market: marketPanel,
        kitchen: kitchenPanel,
        pantry: pantryPanel,
      }[activeTab](),
    );
    const bar = tabBar();
    body.replaceChildren(back, hero(), bar, panel);
    dialog.scrollTop = keepScroll
      ? scrollTop
      : tabs
        ? Math.min(scrollTop, bar.offsetTop - 8)
        : 0;
    if (focusSelector)
      body.querySelector(focusSelector)?.focus({ preventScroll: true });
  }

  function careMeter() {
    const g = garden();
    const row = element("div", "garden-care");
    const leaves = element("span", "garden-care-leaves");
    const max = careMax(g);
    for (let index = 0; index < max; index++)
      leaves.append(element("span", index < careLeft(g) ? "is-left" : "", "🌿"));
    row.append(
      element("span", "garden-care-label", "Công chăm mùa này"),
      leaves,
      element("span", "garden-care-value", `${careLeft(g)}/${max}`),
    );
    const dry = dryCount(g);
    const note = isResting(g) ? "🛌 Vườn đang nghỉ đông"
      : dry ? `🚿 ${dry} luống chưa tưới. Chạm vòi tưới trên từng cây · 1 công/luống.${careLeft(g) ? "" : " Đã hết công chăm mùa này."}`
        : g.weather === "rain" ? "🌧️ Mưa đã tưới cả vườn"
          : "Chạm biểu tượng trên cây để tưới, bắt sâu hoặc thu hoạch.";
    return [row, element("p", "garden-note", note), diligentCard()];
  }
  function flashWatered() {
    if (!reducedMotion.matches)
      body
        .querySelectorAll(".garden-plot.is-watered")
        .forEach((plot) =>
          plot.animate(
            [{ filter: "brightness(1.35)" }, { filter: "brightness(1)" }],
            { duration: 700, easing: "ease-out" },
          ),
        );
  }

  function diligentCard() {
    const g = garden();
    if (isResting(g)) return null;
    const card = element("div", "garden-diligent");
    if (isDiligent(g)) {
      card.classList.add("is-on");
      card.append(
        element(
          "p",
          "",
          `🧑‍🌾 Năm nay bạn dành thời gian chăm kỹ: mỗi mùa có thêm ${DILIGENT_CARE_BONUS} công.`,
        ),
      );
      return card;
    }
    const seasonsLeft = 4 - g.season;
    const blocker = getDiligentBlocker(player());
    const action = button(
      "garden-action garden-diligent-button",
      `🧑‍🌾 Chăm kỹ năm nay · 1 lượt rảnh`,
      () =>
        askConfirm(
          "Dành thời gian chăm kỹ?",
          `Dùng 1 lượt thời gian rảnh của năm nay. Đổi lại, ${seasonsLeft === 4 ? "mỗi mùa trong năm" : `mỗi mùa trong ${seasonsLeft} mùa còn lại của năm`} có thêm ${DILIGENT_CARE_BONUS} công chăm. ${describeActivitySlots(player())}`,
          "🧑‍🌾 Chăm kỹ",
          () => {
            if (!workDiligently(state.player)) return;
            log(
              `🧑‍🌾 Năm nay tôi dành thời gian rảnh ra vườn nhiều hơn, chăm từng luống kỹ càng.`,
            );
            commit(
              `🧑‍🌾 Mùa này bạn có thêm ${DILIGENT_CARE_BONUS} công chăm.`,
              ".garden-plot-tool:not(:disabled)",
            );
          },
        ),
    );
    action.disabled = Boolean(blocker);
    card.append(
      action,
      element(
        "p",
        "garden-diligent-note",
        blocker && !getActivitySlotsLeft(player())
          ? `⏳ ${blocker}`
          : `Thêm ${DILIGENT_CARE_BONUS} công mỗi mùa${seasonsLeft < 4 ? ` cho ${seasonsLeft} mùa còn lại` : ""}. Dùng chung lượt rảnh với ăn uống, rèn luyện, du lịch.`,
      ),
    );
    return card;
  }

  function plotTile(plot, index) {
    const g = garden();
    const tile = element("div", "garden-plot");
    tile.setAttribute("role", "group");
    tile.tabIndex = -1;
    tile.dataset.plot = index;
    const crop = plot && cropOf(plot.crop);
    let label;
    if (!plot) {
      tile.classList.add("is-empty");
      tile.append(element("span", "garden-plot-plus", "＋"), element("span", "garden-plot-name", "Gieo hạt"));
      label = `Luống ${index + 1}: đất trống`;
    } else if (plot.withered) {
      tile.classList.add("is-withered");
      tile.append(element("span", "garden-sprite", "🥀"), element("span", "garden-plot-name", `${crop.name} héo`));
      label = `Luống ${index + 1}: ${crop.name} đã héo`;
    } else {
      const ready = isReady(plot);
      const stage = ready ? crop.icon : plot.growth === 0 ? "🌱" : "🌿";
      tile.classList.toggle("is-ready", ready);
      tile.classList.toggle("is-watered", plot.watered && !ready);
      tile.append(
        element("span", `garden-sprite stage-${ready ? "ready" : plot.growth}`, stage),
        element("span", "garden-plot-name", ready ? `${crop.name} chín` : crop.name),
      );
      const progress = element("span", "garden-plot-progress");
      for (let step = 0; step < crop.grow; step++)
        progress.append(element("span", step < plot.growth ? "is-done" : ""));
      tile.append(progress);
      if (plot.watered && !ready) tile.append(element("span", "garden-badge is-water", "💧"));
      if (plot.fert) tile.append(element("span", "garden-badge is-fert", `🪱${plot.fert}`));
      label = `Luống ${index + 1}: ${crop.name}${ready ? ", đã chín" : `, đã lớn ${plot.growth}/${crop.grow} mùa`}${plot.watered && !ready ? ", đã tưới" : ""}${plot.pest ? ", có sâu" : ""}`;
    }
    tile.classList.toggle("is-selected", selected === index);
    tile.setAttribute("aria-label", label);
    const choose = button("garden-plot-select", "", () => {
      selected = selected === index ? null : index;
      toast = null;
      render({ keepScroll: true, focusSelector: `[data-plot="${index}"] .garden-plot-select` });
    });
    choose.setAttribute("aria-label", `${label}. Chọn luống`);
    choose.setAttribute("aria-pressed", String(selected === index));
    tile.append(choose);

    if (plot && !plot.withered) {
      const tools = element("div", "garden-plot-tools");
      const addTool = (kind, icon, name, disabled, action) => {
        const control = button(`garden-plot-tool garden-plot-${kind}`, icon, action);
        control.setAttribute("aria-label", `${name} · Luống ${index + 1}: ${crop.name}`);
        control.title = disabled ? `${name} — ${isResting(g) ? "Vườn đang nghỉ đông" : "Đã hết công chăm mùa này"}` : name;
        control.disabled = disabled;
        tools.append(control);
      };
      const focusAfterCare = () => {
        const target = `[data-plot="${index}"] .garden-plot-tool:not(:disabled)`;
        return body.querySelector(target) ? target : `[data-plot="${index}"] .garden-plot-select`;
      };
      if (isReady(plot)) {
        addTool("harvest", "🧺", `Thu hoạch ${yieldOf(plot)} phần`, false, () => {
          const amount = harvest(garden(), index);
          if (!amount) return;
          if (selected === index) selected = null;
          commit(`🧺 Bạn thu được ${amount} phần ${lower(crop.name)}. Nông sản đã vào kho.`, `[data-plot="${index}"] .garden-plot-select`);
        });
      } else {
        if (!plot.watered)
          addTool("water", "🚿", "Tưới cây · 1 công", !canWaterPlot(g, index) || isResting(g), () => {
            if (isResting(garden()) || !waterPlot(garden(), index)) return;
            commit("💧 Bạn tưới đẫm luống này.", `[data-plot="${index}"] .garden-plot-select`);
            body.querySelector(focusAfterCare())?.focus({ preventScroll: true });
            flashWatered();
          });
        if (plot.pest)
          addTool("pest", "🐛", "Bắt sâu · 1 công", careLeft(g) === 0 || isResting(g), () => {
            if (isResting(garden()) || !removePest(garden(), index)) return;
            commit("🐛 Bạn lật từng chiếc lá, bắt sạch sâu.", `[data-plot="${index}"] .garden-plot-select`);
            body.querySelector(focusAfterCare())?.focus({ preventScroll: true });
          });
      }
      tile.append(tools);
    }
    if (isResting(g) && !plot) tile.classList.add("is-sleeping");
    return tile;
  }

  function buyPlotTile() {
    const g = garden();
    const price = plotPrice(g);
    if (price === null) return null;
    const tile = button("garden-plot-buy", "", () =>
      askConfirm(
        "Mở thêm luống?",
        `Thuê người làm đất và đóng khung luống mới với giá ${formatMoney(price)}. Luống mở rồi dùng được mãi, nhưng mỗi mùa cần thêm công để tưới.`,
        "🪴 Mở luống",
        () => {
          const paid = buyPlot(state.player);
          if (!paid) return;
          log(
            `🌱 Tôi mở thêm một luống rau ở vườn nhà: Tiền -${formatMoneyAmount(paid)} VNĐ.`,
          );
          selected = g.plotsOwned - 1;
          commit("🪴 Luống mới đã sẵn sàng để gieo hạt.");
        },
      ),
    );
    tile.append(
      element("span", "garden-plot-plus", "🔒"),
      element("span", "garden-plot-name", "Mở luống mới"),
      element("span", "garden-plot-price", formatMoney(price)),
    );
    tile.disabled = player().money < price;
    return tile;
  }

  function plantAndAdvance(index, crop) {
    const g = garden();
    if (!plant(g, index, crop.id)) return;
    selected = null;
    for (let offset = 1; offset < g.plotsOwned; offset++) {
      const next = (index + offset) % g.plotsOwned;
      if (!g.plots[next]) {
        selected = next;
        break;
      }
    }
    const nextNote = selected === null ? "" : ` Chọn hạt cho luống ${selected + 1} để trồng tiếp.`;
    commit(
      `🌱 Bạn gieo ${lower(crop.name)} xuống luống ${index + 1}. Sau ${crop.grow} mùa chăm sẽ thu hoạch được.${nextNote}`,
      `[data-plot="${selected ?? index}"] .garden-plot-select`,
    );
    if (selected !== null) {
      const detail = body.querySelector(".garden-detail:not(.garden-next-step)");
      detail?.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
      detail?.scrollIntoView({ block: "nearest" });
    }
  }

  function plotDetail(index) {
    const g = garden();
    const plot = g.plots[index];
    const card = element("section", "garden-detail");
    if (!plot) {
      card.append(element("h4", "", `🟫 Luống ${index + 1}: đất trống`));
      if (isResting(g)) {
        card.append(
          element(
            "p",
            "garden-note",
            "Đất đang nghỉ qua mùa đông. Sang tuổi mới bạn có thể gieo hạt lại.",
          ),
        );
        return card;
      }
      const owned = crops.filter((crop) => g.seeds[crop.id] > 0 && crop.plant.includes(g.season));
      if (!owned.length) {
        card.append(
          element(
            "p",
            "garden-note",
            "Bạn chưa có hạt giống hợp mùa này. Ghé chợ mua một gói rồi quay lại gieo.",
          ),
          button("garden-action", "🛒 Đến chợ mua hạt", () => {
            activeTab = "market";
            render({ tabs: true });
          }),
        );
        return card;
      }
      card.append(
        element(
          "p",
          "garden-note",
          `Chọn hạt để gieo. Chỉ gieo được những cây hợp ${lower(seasons[g.season].name)}.`,
        ),
      );
      const seeds = element("div", "garden-seed-picks");
      for (const crop of owned) {
        const blocker = getPlantBlocker(g, index, crop.id);
        const pick = button("garden-seed-pick", "", () => plantAndAdvance(index, crop));
        pick.append(
          element("span", "garden-seed-icon", crop.icon),
          element("span", "", `${crop.name} ×${g.seeds[crop.id]}`),
          element(
            "small",
            "",
            blocker || `${crop.grow} mùa · thu ${crop.yield} phần`,
          ),
        );
        pick.disabled = Boolean(blocker);
        seeds.append(pick);
      }
      card.append(seeds);
      return card;
    }
    const crop = cropOf(plot.crop);
    if (plot.withered) {
      card.append(
        element("h4", "", `🥀 Luống ${index + 1}: ${crop.name} đã héo`),
        element(
          "p",
          "garden-note",
          "Nắng hạn làm cây khô rễ khi chưa kịp tưới. Dọn luống để gieo lứa mới.",
        ),
        button("garden-action", "🧹 Dọn luống", () => {
          clearPlot(garden(), index);
          commit(
            "🧹 Luống đã sạch, sẵn sàng cho lứa mới.",
            `[data-plot="${index}"]`,
          );
        }),
      );
      return card;
    }
    const ready = isReady(plot);
    card.append(
      element("h4", "", `${crop.icon} Luống ${index + 1}: ${crop.name}`),
    );
    const facts = element("ul", "garden-facts");
    const fact = (text, tone = "") => facts.append(element("li", tone, text));
    if (ready) fact(`🧺 Đã chín, thu được ${yieldOf(plot)} phần.`, "is-good");
    else {
      fact(`⏳ Đã lớn ${plot.growth}/${crop.grow} mùa.`);
      fact(
        plot.watered
          ? "💧 Đã tưới mùa này."
          : g.weather === "drought"
            ? "🔥 Chưa tưới. Hết mùa sẽ héo vì nắng hạn."
            : "💧 Chưa tưới. Không tưới thì cây không lớn thêm.",
        plot.watered
          ? "is-good"
          : g.weather === "drought"
            ? "is-bad"
            : "is-warn",
      );
      if (plot.pest)
        fact(
          "🐛 Có sâu ăn lá. Không bắt, hết mùa sẽ mất 1 phần thu hoạch.",
          "is-bad",
        );
      fact(
        `🪱 Đã bón ${plot.fert}/${MAX_FERTILIZER} lần · Dự kiến thu ${yieldOf(plot)} phần.`,
      );
    }
    if (plot.penalty)
      fact(`Sâu bệnh đã làm mất ${plot.penalty} phần thu hoạch.`, "is-warn");
    card.append(facts);
    if (!ready) {
      const fert = button(
        "garden-action",
        `🪱 Bón phân · 1 công (còn ${g.goods.phan ?? 0} bao)`,
        () => {
          if (!fertilize(garden(), index)) return;
          commit("🪱 Bạn vun phân quanh gốc. Lứa này sẽ sai quả hơn.", `[data-plot="${index}"]`);
        },
      );
      fert.disabled = !canFertilize(g, index);
      card.append(fert);
    }
    return card;
  }

  function seasonButton() {
    const g = garden();
    if (isResting(g))
      return element(
        "p",
        "garden-rest-note",
        "🛌 Vườn đã qua đủ bốn mùa của năm nay. Sang tuổi mới, mùa xuân sẽ trở lại.",
      );
    const next = g.season < 3 ? seasons[g.season + 1].name : "nghỉ đông";
    const advance = button(
      "garden-action is-primary garden-advance",
      `⏭️ Sang ${lower(next)}`,
      () => {
        const growing = g.plots.filter(
          (plot) => plot && !plot.withered && !isReady(plot),
        );
        const dry = growing.filter((plot) => !plot.watered).length;
        const pests = growing.filter((plot) => plot.pest).length;
        const warnings = [
          dry
            ? g.weather === "drought"
              ? `${dry} luống chưa tưới sẽ héo vì nắng hạn.`
              : `${dry} luống chưa tưới sẽ không lớn thêm.`
            : "",
          pests ? `${pests} luống còn sâu sẽ mất 1 phần thu hoạch.` : "",
        ].filter(Boolean);
        askConfirm(
          `Sang ${lower(next)}?`,
          warnings.length
            ? warnings.join(" ")
            : "Mọi luống đều đã được chăm. Cây sẽ lớn thêm một mùa.",
          "⏭️ Sang mùa",
          () => {
            report = advanceSeason(garden());
            toast = null;
            commit(null, ".garden-advance, .garden-water");
          },
        );
      },
    );
    return advance;
  }

  function reportCard() {
    if (!report) return null;
    const season = seasons[report.season];
    const parts = [
      report.grown
        ? `${report.grown} luống lớn thêm`
        : "không luống nào lớn thêm",
      report.ready ? `${report.ready} luống đã chín` : "",
      report.withered ? `${report.withered} luống héo vì nắng hạn` : "",
      report.pests ? `sâu làm giảm thu hoạch ở ${report.pests} luống` : "",
    ].filter(Boolean);
    const card = element("section", "garden-report");
    card.append(
      element("span", "garden-report-icon", season.icon),
      element("p", "", `Hết ${lower(season.name)}: ${parts.join(", ")}.`),
    );
    return card;
  }

  function nextStepCard() {
    const g = garden();
    const card = element("section", "garden-detail garden-next-step");
    const firstHarvest = Object.keys(g.harvested).length > 0;
    const firstMeal = cookedTotal(g) > 0;
    card.append(element("h3", "", firstMeal ? "🧑‍🌾 Việc tiếp theo" : "🌱 Từ hạt giống đến bữa cơm"));
    const steps = element("p", "garden-note",
      `1. Gieo hạt → 2. Tưới, sang mùa → 3. Thu hoạch → 4. Nấu ăn`);
    card.append(steps);
    const progress = element("p", "garden-note",
      firstMeal ? "Bạn đã nấu được món từ khu vườn. Thử trồng thêm loại cây để mở những món mới."
        : firstHarvest ? "✅ Đã có lần thu hoạch đầu tiên. Mục tiêu tiếp theo: nấu một món trong Bếp."
          : "Mục tiêu đầu tiên: thu hoạch một luống. Bắt đầu với rau muống hoặc hành lá, chỉ cần 1 mùa.");
    card.append(progress);
    const ready = g.plots.findIndex((plot) => isReady(plot));
    const dry = g.plots.findIndex((plot) => plot && !plot.withered && !isReady(plot) && !plot.watered);
    const pest = g.plots.findIndex((plot) => plot && !plot.withered && !isReady(plot) && plot.pest);
    const empty = g.plots.findIndex((plot) => !plot);
    const withered = g.plots.findIndex((plot) => plot?.withered);
    let title, note, label, action;
    if (ready >= 0) {
      const crop = cropOf(g.plots[ready].crop);
      title = `🧺 ${crop.name} đã chín!`;
      note = "Chạm giỏ 🧺 ngay trên cây chín để thu hoạch vào Kho. Bạn có thể bán hoặc giữ lại nấu ăn.";
    } else if (isResting(g)) {
      title = "🛌 Đã chăm vườn xong năm nay";
      note = "Bạn không cần chờ thời gian thực. Đóng vườn và tăng tuổi để bắt đầu mùa xuân mới. Nông sản trong kho vẫn được giữ.";
      label = "🍳 Ghé bếp xem món ăn";
      action = () => { activeTab = "kitchen"; render({ tabs: true }); };
    } else if (dry >= 0) {
      title = g.weather === "drought" ? "🔥 Cứu cây trước khi sang mùa" : "💧 Tưới để cây lớn";
      note = g.weather === "drought"
        ? "Cây chưa tưới sẽ héo nếu sang mùa lúc này. Ưu tiên tưới trước khi bắt sâu hoặc bón phân."
        : "Mỗi luống cần 1 công tưới. Sau khi tưới, bấm Sang mùa để cây lớn; không phải chờ ngoài đời.";
      if (careLeft(g) > 0) {
        note += " Chạm vòi 🚿 ngay trên cây chưa tưới.";
      } else {
        const blocker = getDiligentBlocker(player());
        note += blocker
          ? ` Bạn đã hết công và chưa thể thêm công: ${blocker} Có thể sang mùa, nhưng cây chưa tưới sẽ không lớn hoặc bị héo khi nắng hạn.`
          : " Bạn đã hết công mùa này. Chọn Chăm kỹ để đổi 1 lượt rảnh lấy thêm 3 công mỗi mùa còn lại.";
        label = blocker ? "Xem cảnh báo trước khi sang mùa" : "Xem cách thêm công chăm";
        action = () => {
          const target = body.querySelector(blocker ? ".garden-advance" : ".garden-diligent-button");
          target?.scrollIntoView({ block: "center" });
          target?.focus({ preventScroll: true });
        };
      }
    } else if (pest >= 0 && careLeft(g) > 0) {
      title = "🐛 Bắt sâu để giữ sản lượng";
      note = "Luống này còn sâu. Bắt sâu tốn 1 công; bỏ qua sẽ mất 1 phần thu hoạch khi sang mùa.";
      note += " Chạm biểu tượng 🐛 ngay trên cây để bắt.";
    } else if (!firstMeal && recipes.some((recipe) => !getCookBlocker(g, recipe))) {
      title = "🍳 Đủ nguyên liệu cho món đầu tiên";
      note = "Vào Bếp, chọn món có thể nấu. Ăn món đã nấu giúp tăng chỉ số và dùng 1 lượt rảnh.";
      label = "Vào bếp nấu ăn";
      action = () => { activeTab = "kitchen"; kitchenTier = 0; render({ tabs: true }); };
    } else if (empty >= 0 && (g.weather === "rain" || dryCount(g) < careLeft(g))) {
      const seed = crops.filter((crop) => !getPlantBlocker(g, empty, crop.id))
        .sort((a, b) => a.grow - b.grow)[0];
      title = seed ? `🌱 Gieo ${lower(seed.name)} vào luống trống` : "🌱 Chọn hạt giống đúng mùa";
      note = seed ? `Bạn đã có sẵn hạt. Cây này cần ${seed.grow} mùa được tưới để chín. Gieo hạt không tốn công chăm.`
        : "Chợ chỉ hiện hạt gieo được mùa này. Mua một gói rồi quay lại chạm vào luống trống.";
      label = seed ? `Gieo ${lower(seed.name)} · 1 gói hạt` : "Đến chợ mua hạt";
      action = seed ? () => {
        plantAndAdvance(empty, seed);
      } : () => { activeTab = "market"; marketView = "seeds"; render({ tabs: true }); };
    } else if (withered >= 0) {
      title = "🧹 Dọn luống để bắt đầu lại";
      note = "Cây đã héo không thể hồi phục. Dọn luống không tốn công, rồi gieo lứa mới.";
      label = `Dọn luống ${withered + 1}`;
      action = () => { if (clearPlot(garden(), withered)) commit("🧹 Đã dọn luống. Bạn có thể gieo lại."); };
    } else {
      title = "⏭️ Sẵn sàng sang mùa";
      note = "Cây đã được tưới. Bấm Sang mùa bên dưới để cây lớn thêm một bước. Bón phân là tùy chọn, không bắt buộc.";
      label = "Xem nút sang mùa";
      action = () => { const next = body.querySelector(".garden-advance"); next?.scrollIntoView({ block: "center" }); next?.focus({ preventScroll: true }); };
    }
    card.append(element("h4", "", title), element("p", "garden-note", note));
    if (action) card.append(button("garden-action is-primary garden-next-action", label, action));
    const help = element("details", "garden-quick-help");
    help.append(element("summary", "", "📖 Cách chơi trong 30 giây"),
      element("p", "garden-note", "Gieo → tưới → sang mùa → thu hoạch. Mỗi năm có 4 mùa; bạn chủ động bấm chuyển mùa. Công chăm được làm mới mỗi mùa. Tưới, bắt sâu và bón phân đều tốn 1 công mỗi luống; gieo và thu hoạch không tốn công."),
      element("p", "garden-note", "Mới chơi chỉ cần trồng 1–2 luống cây ngắn ngày. Trời mưa tự tưới cây; nắng hạn thì phải tưới. Chưa cần mua thêm đất hay phân bón. Thu hoạch xong, vào Chợ để bán hoặc vào Bếp để nấu."));
    card.append(help);
    return card;
  }

  function gardenPanel() {
    const g = garden();
    const grid = element("div", "garden-plots");
    g.plots.forEach((plot, index) => grid.append(plotTile(plot, index)));
    const buyTile = buyPlotTile();
    if (buyTile) grid.append(buyTile);
    const nodes = [reportCard(), nextStepCard(), ...careMeter(), grid];
    if (selected !== null && selected < g.plotsOwned)
      nodes.push(plotDetail(selected));
    else
      nodes.push(
        element(
          "p",
          "garden-note garden-hint",
          "Chạm luống trống để chọn hạt. Chạm 🚿, 🐛 hoặc 🧺 ngay trên cây để tưới, bắt sâu hoặc thu hoạch. Chọn cây để xem chi tiết và bón phân.",
        ),
      );
    nodes.push(seasonButton());
    report = null;
    return nodes.filter(Boolean);
  }

  function shopItem(item, { meta, owned, price, badge }) {
    const card = element(
      "article",
      `garden-item${badge ? " is-highlight" : ""}`,
    );
    if (badge) card.append(element("span", "garden-item-badge", badge));
    card.append(
      element("span", "garden-item-icon", item.icon),
      element("h4", "", item.name),
    );
    for (const line of meta)
      card.append(element("p", "garden-item-meta", line));
    const foot = element("div", "garden-item-foot");
    foot.append(
      element("span", "garden-price", formatMoney(price)),
      element("span", "garden-owned", `Có ${owned}`),
    );
    const buttons = element("div", "garden-buy-row");
    for (const amount of [1, 5]) {
      const buyButton = button("garden-buy", `+${amount}`, () => {
        if (!buy(state.player, item.id, amount)) return;
        commit(
          `🛒 Đã mua ${amount} ${cropOf(item.id) ? "gói hạt" : "phần"} ${lower(item.name)}: −${formatMoney(price * amount)}.`,
          `[data-item="${item.id}"] .garden-buy:nth-child(${amount === 1 ? 1 : 2})`,
        );
      });
      buyButton.disabled = player().money < price * amount;
      buyButton.setAttribute("aria-label", `Mua ${amount} ${item.name}`);
      buttons.append(buyButton);
    }
    card.dataset.item = item.id;
    card.append(foot, buttons);
    return card;
  }

  function segment(label, options, current, onPick) {
    const group = element("div", "garden-segment");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    for (const option of options) {
      const node = button("garden-segment-button", "", () => {
        onPick(option.id);
        toast = null;
        render({
          keepScroll: true,
          focusSelector: `[data-segment="${option.id}"]`,
        });
      });
      node.dataset.segment = option.id;
      node.setAttribute("aria-pressed", String(option.id === current));
      node.append(element("span", "", option.label));
      if (option.count)
        node.append(
          element("span", "garden-segment-count", String(option.count)),
        );
      group.append(node);
    }
    return group;
  }

  function marketPanel() {
    const g = garden();
    const stockKinds = crops.filter((crop) => g.goods[crop.id] > 0).length;
    const bar = segment(
      "Gian hàng",
      [
        { id: "seeds", label: "🌱 Hạt giống" },
        { id: "groceries", label: "🥚 Nguyên liệu" },
        { id: "fertilizer", label: "🪱 Phân bón" },
        { id: "sell", label: "💰 Bán", count: stockKinds },
      ],
      marketView,
      (id) => {
        marketView = id;
      },
    );
    return [
      bar,
      { seeds: seedsMarket, groceries: groceryMarket, fertilizer: (garden) => groceryMarket(garden, true), sell: sellMarket }[
        marketView
      ](g),
    ];
  }

  function seedsMarket(g) {
    const seedsSection = element("section", "garden-section");
    seedsSection.append(
      element("h3", "", "🌱 Hạt giống"),
      element(
        "p",
        "garden-note",
        isResting(g)
          ? "Vườn đang nghỉ đông. Hạt giống sẽ được bán lại vào mùa xuân năm sau."
          : `Chỉ bán hạt giống gieo được trong ${lower(seasons[g.season].name)}. Mỗi gói gieo được một luống.`,
      ),
    );
    const seedGrid = element("div", "garden-items");
    const seasonalCrops = isResting(g)
      ? []
      : crops.filter((crop) => crop.plant.includes(g.season));
    for (const crop of seasonalCrops) {
      seedGrid.append(
        shopItem(crop, {
          meta: [
            `🗓️ Gieo: ${seasonList(crop.plant)}`,
            `⏳ ${crop.grow} mùa · 🧺 ${crop.yield} phần`,
          ],
          owned: g.seeds[crop.id] ?? 0,
          price: crop.seed,
          badge:
            !isResting(g) && crop.plant.includes(g.season)
              ? "Gieo được mùa này"
              : "",
        }),
      );
    }
    seedsSection.append(seedGrid);
    return seedsSection;
  }

  function groceryMarket(g, fertilizer = false) {
    const grocerySection = element("section", "garden-section");
    grocerySection.append(
      element("h3", "", fertilizer ? "🪱 Phân bón" : "🧺 Nguyên liệu nấu ăn"),
      element(
        "p",
        "garden-note",
        fertilizer
          ? "Mua phân hữu cơ để bón cho cây, tăng số phần thu hoạch."
          : "Những thứ vườn nhà không tự làm ra được, cần cho các món vừa và món phức tạp.",
      ),
    );
    const groceryGrid = element("div", "garden-items");
    for (const item of groceries.filter((item) => (item.id === "phan") === fertilizer)) {
      groceryGrid.append(
        shopItem(item, {
          meta: [item.note ?? "Nguyên liệu nấu ăn."],
          owned: g.goods[item.id] ?? 0,
          price: item.price,
        }),
      );
    }
    grocerySection.append(groceryGrid);
    return grocerySection;
  }

  function sellMarket(g) {
    const sellSection = element("section", "garden-section");
    sellSection.append(
      element("h3", "", "💰 Bán nông sản"),
      element(
        "p",
        "garden-note",
        "Rau trái vườn nhà chủ yếu để nấu ăn, bán chỉ là thêm chút tiền chợ. Giá đổi theo từng mùa, chờ giá tốt rồi bán cũng được.",
      ),
    );
    const stock = crops.filter((crop) => g.goods[crop.id] > 0);
    if (!stock.length)
      sellSection.append(
        element(
          "p",
          "garden-empty",
          "Kho chưa có nông sản. Thu hoạch xong sẽ bán được ở đây.",
        ),
      );
    for (const crop of stock) {
      const price = sellPriceOf(g, crop.id);
      const rate = g.prices?.[crop.id] ?? 1;
      const row = element("div", "garden-sell-row");
      row.dataset.sell = crop.id;
      const info = element("div", "garden-sell-info");
      info.append(
        element("strong", "", `${crop.icon} ${crop.name} ×${g.goods[crop.id]}`),
        element(
          "span",
          `garden-trend ${rate >= 1.1 ? "is-up" : rate <= 0.9 ? "is-down" : ""}`,
          `${formatMoney(price)}/phần ${rate >= 1.1 ? "▲ giá cao" : rate <= 0.9 ? "▼ giá thấp" : "· giá thường"}`,
        ),
      );
      const sellOne = button("garden-buy", "Bán 1", () => doSell(crop, 1));
      const sellAll = button("garden-buy is-strong", "Bán hết", () =>
        doSell(crop, g.goods[crop.id]),
      );
      row.append(info, sellOne, sellAll);
      sellSection.append(row);
    }
    if (g.earned)
      sellSection.append(
        element(
          "p",
          "garden-note",
          `Tổng tiền bán nông sản từ trước tới nay: ${formatMoney(g.earned)}.`,
        ),
      );
    return sellSection;
  }

  function doSell(crop, amount) {
    const income = sell(state.player, crop.id, amount);
    if (!income) return;
    log(
      `🧺 Tôi bán ${amount} phần ${lower(crop.name)} ở chợ: Tiền +${formatMoneyAmount(income)} VNĐ.`,
    );
    commit(
      `💰 Bán ${amount} phần ${lower(crop.name)}, thu về ${formatMoney(income)}.`,
      `[data-sell="${crop.id}"] .garden-buy, .garden-tab[aria-selected="true"]`,
    );
  }

  const effectChips = (effects, real = null) => {
    const row = element("div", "garden-effects");
    for (const [stat, value] of Object.entries(effects)) {
      const gain = real ? real[stat] : value;
      row.append(
        element(
          "span",
          "garden-effect",
          `${STAT_LABELS[stat]} +${gain}${real && gain < value ? ` (tối đa +${value})` : ""}`,
        ),
      );
    }
    return row;
  };

  function kitchenPanel() {
    const g = garden();
    const total = cookedTotal(g);
    const rank = cookRank(g);
    const next = cookTiers.find((tier) => tier.minCooked > total);
    const skill = element("section", "garden-skill");
    const bar = element("div", "garden-skill-bar");
    const fill = element("span");
    const from = rank.minCooked;
    fill.style.width = `${next ? Math.round(((total - from) / (next.minCooked - from)) * 100) : 100}%`;
    bar.append(fill);
    skill.append(
      element("span", "garden-skill-icon", "🧑‍🍳"),
      element("div", ""),
    );
    skill.lastChild.append(
      element("p", "garden-skill-rank", rank.rank),
      bar,
      element(
        "p",
        "garden-note",
        next
          ? `Đã nấu ${total} món · nấu thêm ${next.minCooked - total} món để mở ${lower(next.name)}.`
          : `Đã nấu ${total} món · mở khóa mọi công thức.`,
      ),
    );
    const tierBar = segment(
      "Mức món",
      cookTiers.map((tier) => ({
        id: tier.id,
        label: `${total >= tier.minCooked ? "" : "🔒 "}${capitalize(tier.name.replace("Món ", ""))}`,
        count: recipes.filter(
          (recipe) => recipe.tier === tier.id && !getCookBlocker(g, recipe),
        ).length,
      })),
      kitchenTier,
      (id) => {
        kitchenTier = id;
      },
    );
    const tier = cookTiers[kitchenTier];
    const unlocked = total >= tier.minCooked;
    const section = element("section", "garden-section");
    section.append(element("h3", "", `${unlocked ? "📖" : "🔒"} ${tier.name}`));
    section.append(
      element(
        "p",
        "garden-note",
        unlocked
          ? "Số đỏ trên thanh chọn là số món đủ nguyên liệu để nấu ngay."
          : `Mở khi đã nấu đủ ${tier.minCooked} món. Bạn vẫn xem trước được công thức.`,
      ),
    );
    const list = element("div", "garden-recipes");
    for (const recipe of recipes.filter((item) => item.tier === tier.id))
      list.append(recipeCard(recipe, unlocked));
    section.append(list);
    return [skill, tierBar, section];
  }

  function recipeCard(recipe, unlocked) {
    const g = garden();
    const card = element(
      "article",
      `garden-recipe tier-${recipe.tier}${unlocked ? "" : " is-locked"}`,
    );
    card.dataset.recipe = recipe.id;
    const head = element("div", "garden-recipe-head");
    const title = element("div");
    title.append(
      element("h4", "", recipe.name),
      element("p", "garden-recipe-desc", recipe.description),
    );
    head.append(element("span", "garden-recipe-icon", recipe.icon), title);
    if (g.cooked[recipe.id])
      head.append(
        element("span", "garden-cooked", `Đã nấu ${g.cooked[recipe.id]}`),
      );
    const needs = element("div", "garden-needs");
    const missing = new Set(missingFor(g, recipe).map(([id]) => id));
    for (const [id, count] of Object.entries(recipe.needs)) {
      const item = ingredientOf(id);
      needs.append(
        element(
          "span",
          `garden-need ${missing.has(id) ? "is-missing" : "is-ok"}`,
          `${item.icon} ${item.name} ${Math.min(g.goods[id] ?? 0, count)}/${count}`,
        ),
      );
    }
    const blocker = getCookBlocker(g, recipe);
    const action = button(
      "garden-action is-primary garden-cook",
      blocker && unlocked
        ? "Thiếu nguyên liệu"
        : blocker
          ? "🔒 Chưa mở"
          : "🍳 Nấu món này",
      () => {
        const first = !g.cooked[recipe.id];
        if (!cook(garden(), recipe.id)) return;
        if (first && recipe.tier === 2)
          log(
            `🧑‍🍳 Lần đầu tôi tự nấu được ${lower(recipe.name)}, một món cầu kỳ từ rau trái vườn nhà.`,
          );
        commit(
          `${recipe.icon} ${recipe.name} đã xong, thơm lừng cả gian bếp. Món đã vào kho, ăn được tới hết năm nay.`,
          `[data-recipe="${recipe.id}"] .garden-cook`,
        );
        if (!reducedMotion.matches) {
          body
            .querySelector(`[data-recipe="${recipe.id}"] .garden-recipe-icon`)
            ?.animate(
              [
                { transform: "scale(1) rotate(0)" },
                { transform: "scale(1.35) rotate(-10deg)" },
                { transform: "scale(1) rotate(0)" },
              ],
              { duration: 600, easing: "cubic-bezier(0.2, 0.9, 0.3, 1.3)" },
            );
        }
      },
    );
    action.disabled = Boolean(blocker);
    card.append(head, needs, effectChips(recipe.effects), action);
    return card;
  }

  // ---------- Kho ----------
  function pantryPanel() {
    const g = garden();
    const p = player();
    const dishSection = element("section", "garden-section");
    dishSection.append(
      element("h3", "", "🍽️ Món đã nấu"),
      element("p", "garden-note", ``),
    );
    const ready = recipes.filter((recipe) => g.dishes[recipe.id] > 0);
    if (!ready.length)
      dishSection.append(
        element(
          "p",
          "garden-empty",
          "Chưa có món nào. Vào Bếp nấu từ rau trái vườn nhà nhé.",
        ),
      );
    const list = element("div", "garden-recipes");
    for (const recipe of ready) {
      const card = element(
        "article",
        `garden-recipe garden-dish tier-${recipe.tier}`,
      );
      card.dataset.dish = recipe.id;
      const head = element("div", "garden-recipe-head");
      const title = element("div");
      title.append(
        element("h4", "", recipe.name),
        element(
          "p",
          "garden-recipe-desc",
          `${g.dishes[recipe.id]} phần · ${cookTiers[recipe.tier].name}`,
        ),
      );
      head.append(element("span", "garden-recipe-icon", recipe.icon), title);
      const eaten = hasEatenThisYear(g, p.age, recipe.id);
      const free = getActivitySlotsLeft(p) > 0;
      const preview = Object.fromEntries(
        Object.entries(recipe.effects).map(([stat, value]) => [
          stat,
          previewActivityGain(p, stat, value),
        ]),
      );
      const action = button(
        "garden-action is-primary garden-eat",
        eaten ? "✅ Đã ăn năm nay" : !free ? NO_SLOT_LABEL : "🍴 Ăn món này",
        () => {
          const gains = eat(state.player, recipe.id);
          if (!gains) return;
          const changes = Object.entries(gains)
            .filter(([, value]) => value)
            .map(([stat, value]) => `${STAT_LABELS[stat]} +${value}`);
          log(
            `${recipe.icon} Tôi ăn món ${lower(recipe.name)} tự nấu từ vườn nhà${changes.length ? ` · ${changes.join(" · ")}` : ""}.`,
          );
          renderStats();
          commit(
            `${recipe.icon} Ngon miệng! ${changes.length ? changes.join(" · ") : "Chỉ số đã ở mức tối đa năm nay."}`,
            '.garden-eat:not(:disabled), .garden-tab[aria-selected="true"]',
          );
        },
      );
      action.disabled = eaten || !free || p.isAlive === false;
      card.append(head, effectChips(recipe.effects, preview), action);
      list.append(card);
    }
    dishSection.append(list);

    const storeSection = element("section", "garden-section");
    storeSection.append(element("h3", "", "🧺 Kho nguyên liệu"));
    const chips = element("div", "garden-stock");
    const stock = [...crops, ...groceries].filter(
      (item) => g.goods[item.id] > 0,
    );
    for (const item of stock)
      chips.append(
        element(
          "span",
          "garden-stock-chip",
          `${item.icon} ${item.name} ×${g.goods[item.id]}`,
        ),
      );
    if (!stock.length)
      chips.append(element("p", "garden-empty", "Kho đang trống."));
    const seedStock = crops.filter((crop) => g.seeds[crop.id] > 0);
    storeSection.append(chips);
    if (seedStock.length) {
      const seedChips = element("div", "garden-stock");
      for (const crop of seedStock)
        seedChips.append(
          element(
            "span",
            "garden-stock-chip is-seed",
            `🌰 Hạt ${lower(crop.name)} ×${g.seeds[crop.id]}`,
          ),
        );
      storeSection.append(
        element("h4", "garden-subtitle", "Hạt giống chưa gieo"),
        seedChips,
      );
    }
    return [dishSection, storeSection];
  }

  $("activity-garden").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    toast = null;
    report = null;
    if (state.player.age >= GARDEN_MIN_AGE) {
      if (!state.player.garden) {
        const gifts = Object.entries(STARTER_SEEDS).map(
          ([id, count]) => `${count} gói hạt ${lower(cropOf(id).name)}`,
        );
        toast = `🎁 Nhà còn sẵn ${gifts.join(" và ")}. Chạm vào một luống để gieo thử.`;
      }
      gardenOf(state.player);
      saveGame(state);
    }
    render();
    dialog.showModal();
    body
      .querySelector('.garden-tab[aria-selected="true"]')
      ?.focus({ preventScroll: true });
  });
  $("close-garden").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => checkAchievements?.());
}
