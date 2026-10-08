import { createInitialState } from "./state.js";
import {
  maleNames,
  femaleNames,
  provinces,
  pick,
  validateCharacter,
} from "./character-data.js";
import {
  SAVE_KEY,
  recoverTicketPurchase,
  getTickets,
  addTickets,
  MAX_TICKETS_PER_PURCHASE,
  readSavedGame,
  canContinue,
  startLife,
} from "./ticket-store.js";

export function initLobby(enterGame) {
  const get = (id) => document.getElementById(id);
  const home = get("lobby-screen");
  const newButton = get("new-life-button");
  const continueButton = get("continue-button");
  const ticketsDialog = get("tickets-dialog");
  const createDialog = get("create-character-dialog");
  const randomGenderDialog = get("random-gender-dialog");
  const form = get("create-character-form");
  const error = get("create-character-error");
  let expectedSave = null;
  let busy = false;
  let storageReady = true;
  function showError(message) {
    get("lobby-message").textContent = message;
  }
  function refresh() {
    try {
      recoverTicketPurchase();
      get("ticket-count").textContent = getTickets().toLocaleString("vi-VN");
      let saved = null;
      try {
        saved = readSavedGame();
      } catch {
        showError("Bản lưu cũ không đọc được. Bạn có thể tạo cuộc đời mới.");
      }
      continueButton.hidden = !canContinue(saved);
      storageReady = true;
    } catch (e) {
      storageReady = false;
      continueButton.hidden = true;
      showError("Không đọc được dữ liệu lưu. " + e.message);
    }
  }
  function close(dialog) {
    if (dialog.open) dialog.close();
  }
  get("ticket-seller").addEventListener("click", () => {
    if (!storageReady || busy) return;
    try {
      const remaining = getTickets();
      if (remaining > 0) {
        showError(`Bạn còn ${remaining} vé. Hãy dùng hết vé hiện có trước khi nhận thêm.`);
        return;
      }
    } catch (e) {
      showError(e.message);
      return;
    }
    get("ticket-error").textContent = "";
    ticketsDialog.showModal();
  });
  get("close-tickets").addEventListener("click", () => close(ticketsDialog));
  get("ticket-quantity").max = MAX_TICKETS_PER_PURCHASE;
  get("ticket-max").addEventListener("click", () => {
    get("ticket-quantity").value = MAX_TICKETS_PER_PURCHASE;
    get("ticket-error").textContent = "";
    get("ticket-quantity").dispatchEvent(new Event("input", { bubbles: true }));
  });
  get("ticket-form").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      addTickets(Number(get("ticket-quantity").value));
      refresh();
      close(ticketsDialog);
      showError("Vé đã sẵn sàng. Chúc bạn có một chuyến đi đáng nhớ!");
    } catch (e) {
      get("ticket-error").textContent = e.message;
    }
  });
  newButton.addEventListener("click", () => {
    if (busy || !storageReady) return;
    try {
      if (getTickets() < 1) {
        showError(
          "Bạn chưa có vé. Nhấn nhân viên ở góc trái để nhận vé miễn phí nhé!",
        );
        get("ticket-seller").focus();
        return;
      }
      expectedSave = localStorage.getItem(SAVE_KEY);
      form.hidden = true;
      form.reset();
      error.textContent = "";
      get("character-options").hidden = false;
      createDialog.showModal();
    } catch (e) {
      showError(e.message);
    }
  });
  get("close-create-character").addEventListener("click", () =>
    close(createDialog),
  );
  get("custom-character-button").addEventListener("click", () => {
    get("character-options").hidden = true;
    form.hidden = false;
    error.textContent = "";
    get("new-character-name").focus();
  });
  get("back-character-options").addEventListener("click", () => {
    form.hidden = true;
    get("character-options").hidden = false;
    error.textContent = "";
  });
  async function commit(name, province, gender) {
    if (busy) return;
    const values = validateCharacter(name, province);
    if (values.error) {
      error.textContent = values.error;
      if (!form.hidden)
        get(
          values.field === "name"
            ? "new-character-name"
            : "new-character-province",
        ).focus();
      return;
    }
    busy = true;
    try {
      const next = createInitialState();
      Object.assign(next.player, {
        name: values.name,
        province: values.province,
        gender: gender === "female" ? "female" : "male",
      });
      for (const key of ["health", "intelligence", "happiness", "appearance"]) {
        next.player[key] = Math.floor(Math.random() * 81) + 10;
      }
      next.logs.push({
        age: 0,
        content:
          `Bạn tên là ${values.name}, chào đời tại ${values.province}. ` +
          pick([
            "Bạn chào đời trong vòng tay yêu thương của gia đình.",
            "Tiếng khóc đầu tiên của bạn khiến cả nhà xúc động.",
            "Bạn chào đời vào một buổi sáng yên bình.",
          ]),
      });
      startLife(next, expectedSave);
      close(randomGenderDialog);
      close(createDialog);
      await enterGame(next);
    } catch (e) {
      if (randomGenderDialog.open) {
        close(randomGenderDialog);
        createDialog.showModal();
      }
      error.textContent = e.message;
      showError("Chưa vào được game: " + e.message);
      refresh();
    } finally {
      busy = false;
    }
  }
  get("random-character-button").addEventListener("click", () => {
    if (busy) return;
    close(createDialog);
    randomGenderDialog.showModal();
  });
  function backToCharacterCreation() {
    if (busy) return;
    close(randomGenderDialog);
    createDialog.showModal();
    get("random-character-button").focus();
  }
  get("close-random-gender").addEventListener("click", backToCharacterCreation);
  randomGenderDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    backToCharacterCreation();
  });
  for (const gender of ["male", "female"]) {
    get(`random-gender-${gender}`).addEventListener("click", () => {
      const nameList = gender === "female" ? femaleNames : maleNames;
      commit(pick(nameList), pick(provinces), gender);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    commit(
      get("new-character-name").value,
      get("new-character-province").value,
      form.querySelector('input[name="character-gender"]:checked').value,
    );
  });
  continueButton.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    try {
      recoverTicketPurchase();
      const saved = readSavedGame();
      if (!canContinue(saved)) {
        refresh();
        return;
      }
      await enterGame(saved);
    } catch (e) {
      showError("Chưa vào được game: " + e.message);
    } finally {
      busy = false;
    }
  });
  window.addEventListener("storage", () => {
    if (!home.hidden) refresh();
  });
  refresh();
}
