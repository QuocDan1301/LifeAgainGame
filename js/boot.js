import { state, createInitialState } from "./state.js";
import { initLobby } from "./lobby.js";

let entering = false;
initLobby(async saved => {
  if (entering) return;
  entering = true;
  const initial = createInitialState();
  Object.assign(state, initial, saved);
  state.player = { ...initial.player, ...saved.player };
  state.pendingEvent = saved.pendingEvent ?? null;
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
