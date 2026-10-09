import { state, createInitialState } from "./state.js";
import { initLobby } from "./lobby.js";
import { getCareerProfile } from "./career-jobs.js";
import { restoreMarriageSchedule } from "./relationships.js";
import { migrateChildcareDebt } from "./family.js";
import { getEventCategory } from "./event-category.js";
import { createOrientationEvent } from "./special-event-24.js";

let entering = false;
initLobby(async saved => {
  if (entering) return;
  entering = true;
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
    document.querySelector(".journal").focus({ preventScroll: true });
  } catch (error) {
    document.getElementById("game-screen").hidden = true;
    document.getElementById("lobby-screen").hidden = false;
    // Không khởi tạo lại module đã chạy dở và gắn trùng sự kiện.
    document.getElementById("new-life-button").disabled = true;
    document.getElementById("continue-button").disabled = true;
    throw new Error("Không tải được phần chơi. Vé và cuộc đời đã lưu; sửa lỗi Console rồi tải lại trang để Chơi tiếp. " + error.message);
  }
});
