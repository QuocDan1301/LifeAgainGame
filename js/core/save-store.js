export const SAVE_KEY = "lifeAgainSave";
let expectedSave;
let releaseLock;
let lockTask;
let blocked = false;
let failedState;
const pauseListeners = new Set();
export const isSavePaused = () => blocked;
export function onSavePaused(listener) {
  pauseListeners.add(listener);
  return () => pauseListeners.delete(listener);
}
function pauseGame() {
  blocked = true;
  for (const listener of pauseListeners) {
    try { listener(); } catch (error) { console.warn("Không dừng được tác vụ nền:", error); }
  }
}

// Ticket recovery shares the playing lock and rereads its journal after acquisition.
export async function withSaveLock(action) {
  if (releaseLock) return action();
  if (!globalThis.navigator?.locks) throw new Error("Trình duyệt chưa hỗ trợ khóa lưu an toàn.");
  return navigator.locks.request("lifeAgain-playing", { ifAvailable: true }, lock => {
    if (!lock) throw new Error("Game đang được chơi ở tab khác. Hãy đóng tab đó trước khi phục hồi tiến trình.");
    return action();
  });
}

// Hold one playing session per origin. Other tabs may still browse the lobby.
export async function endSaveSession() {
  const task = lockTask;
  releaseLock?.();
  releaseLock = null;
  lockTask = undefined;
  expectedSave = undefined;
  if (task) await task.catch(() => {});
}

export async function beginSaveSession() {
  // Comparing localStorage values cannot atomically lock two browser tabs.
  // Refuse entry when an exclusive lock is unavailable rather than risk a save.
  if (!globalThis.navigator?.locks) {
    throw new Error("Trình duyệt này chưa hỗ trợ khóa phiên chơi an toàn. Hãy mở game bằng Chrome, Edge, Firefox hoặc Safari bản mới qua HTTPS hoặc localhost.");
  }
  try {
    if (!releaseLock) {
      await new Promise((resolve, reject) => {
        lockTask = navigator.locks.request("lifeAgain-playing", { ifAvailable: true }, lock => {
          if (!lock) {
            reject(new Error("Game đang được chơi ở tab khác. Hãy đóng tab đó trước khi chơi tại đây."));
            return;
          }
          return new Promise(release => {
            releaseLock = release;
            resolve();
          });
        });
        lockTask.catch(reject);
      });
    }
    expectedSave = localStorage.getItem(SAVE_KEY);
    blocked = false;
  } catch (error) {
    await endSaveSession();
    throw error;
  }
}

export function trackSavedGame() {
  expectedSave = localStorage.getItem(SAVE_KEY);
}

function showSaveFailure(error, conflict) {
  if (typeof document === "undefined") return;
  const existing = document.getElementById("save-error-dialog");
  if (existing) {
    if (conflict) {
      existing.dataset.conflict = "true";
      existing.querySelector("p").textContent = "Tiến trình đã thay đổi ở tab khác. Tải lại để mở tiến trình mới nhất.";
      existing.querySelector("button").textContent = "Tải lại tiến trình";
    }
    return;
  }
  const dialog = document.createElement("dialog");
  dialog.id = "save-error-dialog";
  dialog.dataset.conflict = String(conflict);
  const message = document.createElement("p");
  message.textContent = conflict
    ? "Tiến trình đã thay đổi ở tab khác. Tab này đã dừng để bảo vệ bản lưu. Tải lại để mở tiến trình mới nhất."
    : "Chưa lưu được tiến trình. Game đã tạm dừng; đừng đóng hoặc tải lại tab này. Hãy giải phóng dung lượng lưu trữ hoặc cho phép trình duyệt lưu dữ liệu, rồi thử lưu lại.";
  const button = document.createElement("button");
  button.textContent = conflict ? "Tải lại tiến trình" : "Thử lưu lại";
  button.addEventListener("click", () => {
    if (dialog.dataset.conflict === "true") { location.reload(); return; }
    try {
      blocked = false;
      saveGame(failedState);
      location.reload();
    } catch (retryError) {
      message.textContent = retryError.message;
    }
  });
  dialog.addEventListener("cancel", event => event.preventDefault());
  dialog.append(message, button);
  document.body.append(dialog);
  dialog.showModal();
}

export function saveGame(state) {
  if (blocked) throw new Error("Game đã tạm dừng vì chưa lưu được tiến trình.");
  let conflict = false;
  try {
    const current = localStorage.getItem(SAVE_KEY);
    if (expectedSave === undefined) expectedSave = current;
    if (current !== expectedSave) {
      conflict = true;
      throw new Error("Tiến trình đã thay đổi ở tab khác. Hãy tải lại để tránh ghi đè bản lưu.");
    }
    const next = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, next);
    expectedSave = next;
  } catch (cause) {
    pauseGame();
    failedState = structuredClone(state);
    const error = conflict ? cause : new Error("Không lưu được tiến trình. Hãy kiểm tra dung lượng và quyền lưu dữ liệu của trình duyệt, rồi thử lưu lại.", { cause });
    showSaveFailure(error, conflict);
    throw error;
  }
}

if (typeof window !== "undefined") {
  // Stop game handlers from mutating the unsaved state after a write failure.
  for (const type of ["click", "submit", "keydown", "pointerdown"]) {
    window.addEventListener(type, event => {
      if (!blocked || event.target?.closest?.("#save-error-dialog")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }
  window.addEventListener("storage", event => {
    if (expectedSave === undefined || (event.key !== SAVE_KEY && event.key !== null)) return;
    if (localStorage.getItem(SAVE_KEY) !== expectedSave) {
      pauseGame();
      showSaveFailure(new Error("Tiến trình thay đổi ở tab khác."), true);
    }
  });
  // A bfcache-restored page must reacquire the lock through the lobby.
  window.addEventListener("pagehide", () => { void endSaveSession(); });
  window.addEventListener("pageshow", event => { if (event.persisted) location.reload(); });
}
