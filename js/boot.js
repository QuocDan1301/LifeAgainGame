// Bến xe chỉ tải phần nhỏ cần cho nó. Phần chơi (dữ liệu và ảnh sự kiện...) nặng hơn nhiều
// nên chỉ tải khi người chơi vào game, lúc đó màn hình tải sẽ che.
import { state, createInitialState } from "./state.js";
import { initLobby } from "./lobby.js";
import { canRetryModuleLoad, clearModuleRetry, refreshModuleCache, warmModuleCache } from "./module-refresh.js";
import { initMusic } from "./music.js";
import { moveCloseButtonsOutside } from "./dialog-close.js";

// Nút ✕ của mọi popup nằm ngoài khung, ở góc trên bên phải.
moveCloseButtonsOutside();
initMusic();

// Khi bến xe đã hiện, tải sẵn phần chơi vào bộ nhớ đệm lúc máy rảnh để bấm vào game nhanh hơn.
const warmGame = () => warmModuleCache(["./main.js"]);
if ("requestIdleCallback" in window) requestIdleCallback(warmGame, { timeout: 4000 });
else setTimeout(warmGame, 1500);

// File JS cũ trong bộ nhớ đệm không khớp bản mới: tải lại toàn bộ rồi mở lại trang (một lần mỗi phiên).
async function recoverFromStaleFiles() {
  if (!canRetryModuleLoad()) return false;
  document.getElementById("game-screen").hidden = true;
  document.getElementById("lobby-screen").hidden = false;
  document.getElementById("lobby-message").textContent = "Đang cập nhật phiên bản mới của game…";
  window.appLoader?.show("Đang cập nhật phiên bản mới");
  await refreshModuleCache(["./boot.js", "./main.js"]);
  location.reload();
  return true;
}

let entering = false;
initLobby(async saved => {
  if (entering) return;
  entering = true;
  // Màn hình tải che lúc tải phần chơi (khoảng 70 file JS ở lần đầu).
  window.appLoader?.show("Đang chuẩn bị cuộc đời");
  let modules;
  try {
    modules = await Promise.all([
      import("./career-jobs.js"),
      import("./relationships.js"),
      import("./family.js"),
      import("./event-category.js"),
      import("./special-event-24.js"),
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
  // Khôi phục tuổi nâng bậc lần đầu từ nhật ký của bản lưu cũ.
  if (saved.player.nextPromotionAge === undefined && state.player.careerLevel >= 2) {
    const firstPromotion = state.logs?.find(log =>
      Number.isInteger(log.age) && log.content?.includes("bạn được nâng lên bậc"));
    const finalAge = firstPromotion ? firstPromotion.age + 10 : null;
    state.player.nextPromotionAge = state.player.careerLevel === 2 &&
      finalAge !== null && finalAge <= 39 ? finalAge : null;
  }
  // Đồng bộ tên bậc nghề trong bản lưu cũ với danh sách hiện tại.
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
    // Không khởi tạo lại module đã chạy dở và gắn trùng sự kiện.
    document.getElementById("new-life-button").disabled = true;
    document.getElementById("continue-button").disabled = true;
    throw new Error("Không tải được phần chơi. Vé và cuộc đời đã lưu; sửa lỗi Console rồi tải lại trang để Chơi tiếp. " + error.message);
  }
});
