 
 
import { state, createInitialState } from "./core/state.js";
import { initLobby } from "./ui/lobby.js";
import { canRetryModuleLoad, clearModuleRetry, refreshModuleCache, warmModuleCache } from "./core/module-refresh.js";
import { initMusic } from "./ui/music.js";
import { moveCloseButtonsOutside } from "./ui/dialog-close.js";
import { initOffline } from "./core/offline.js";

 
moveCloseButtonsOutside();
initMusic();
 
initOffline(() => !document.getElementById("lobby-screen").hidden && !document.querySelector("dialog[open]"));

 
const warmGame = () => warmModuleCache([new URL("./main.js", import.meta.url).href]);
if ("requestIdleCallback" in window) requestIdleCallback(warmGame, { timeout: 4000 });
else setTimeout(warmGame, 1500);

 
async function recoverFromStaleFiles() {
  if (!canRetryModuleLoad()) return false;
  document.getElementById("game-screen").hidden = true;
  document.getElementById("lobby-screen").hidden = false;
  document.getElementById("lobby-message").textContent = "Đang cập nhật phiên bản mới của game…";
  window.appLoader?.show("Đang cập nhật phiên bản mới");
  await refreshModuleCache([new URL("./boot.js", import.meta.url).href, new URL("./main.js", import.meta.url).href]);
  location.reload();
  return true;
}

let entering = false;
initLobby(async saved => {
  if (entering) return;
  entering = true;
   
  window.appLoader?.show("Đang chuẩn bị cuộc đời");
  let modules;
  try {
    modules = await Promise.all([
      import("./career/career-jobs.js"),
      import("./relationships/relationships.js"),
      import("./relationships/family.js"),
      import("./events/event-category.js"),
      import("./special-events/special-event-24.js"),
    ]);
  } catch (error) {
    if (await recoverFromStaleFiles()) return;
    entering = false;
    window.appLoader?.hide();
    throw new Error("Không tải được phần chơi. Vé và cuộc đời đã lưu; kiểm tra mạng rồi tải lại trang. " + error.message);
  }
  const [{ getCareerProfile }, { restoreMarriageSchedule }, { migrateChildcareDebt },
    { getEventCategory }, { createOrientationEvent }] = modules;

  const initial = createInitialState();
  Object.assign(state, initial, saved);
  state.player = { ...initial.player, ...saved.player };
  restoreMarriageSchedule(state.player, saved.player.marriageScheduleVersion ?? 1);
   
  if (saved.player.nextPromotionAge === undefined && state.player.careerLevel >= 2) {
    const firstPromotion = state.logs?.find(log =>
      Number.isInteger(log.age) && log.content?.includes("bạn được nâng lên bậc"));
    const finalAge = firstPromotion ? firstPromotion.age + 10 : null;
    state.player.nextPromotionAge = state.player.careerLevel === 2 &&
      finalAge !== null && finalAge <= 39 ? finalAge : null;
  }
   
  if (state.player.employmentStatus === "employed" &&
      Number.isInteger(state.player.careerLevel) &&
      state.player.careerLevel >= 1 && state.player.careerLevel <= 3) {
    state.player.job = getCareerProfile(state.player.careerPath?.id)
      .ranks[state.player.careerLevel - 1];
  }
  state.pendingEvent = saved.pendingEvent ?? null;
  // Old saves may have queued a second, unrelated story for the same year.
  state.followUpEvent = null;
  if (state.pendingEvent?.age === 24) {
    if (getEventCategory(state.pendingEvent) === "everyday") {
      state.pendingEvent = { ...createOrientationEvent(state.player), stage: "choice", age: 24 };
    }
  }
  migrateChildcareDebt(state.player, state.pendingEvent?.updates);
  if (state.pendingEvent?.kind === "marriage-proposal" && state.pendingEvent.stage === "choice" &&
      state.pendingEvent.age < state.player.nextMarriageProposalAge) {
    state.pendingEvent = null;
  }
  document.getElementById("lobby-screen").hidden = true;
  document.getElementById("game-screen").hidden = false;
  try {
    await import("./main.js");
    clearModuleRetry();
    window.appLoader?.hide();
    document.querySelector(".journal").focus({ preventScroll: true });
  } catch (error) {
    if (await recoverFromStaleFiles()) return;
    window.appLoader?.hide();
    document.getElementById("game-screen").hidden = true;
    document.getElementById("lobby-screen").hidden = false;
     
    document.getElementById("new-life-button").disabled = true;
    document.getElementById("continue-button").disabled = true;
    throw new Error("Không tải được phần chơi. Vé và cuộc đời đã lưu; sửa lỗi Console rồi tải lại trang để Chơi tiếp. " + error.message);
  }
});
