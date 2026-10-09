// Hộp xác nhận dùng chung cho mua, bán, nhận việc và nghỉ việc.
let pendingAction = null;
let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;
  const dialog = document.getElementById("shop-confirm-dialog");
  const confirmButton = document.getElementById("shop-confirm");
  document.getElementById("shop-cancel").addEventListener("click", () => {
    pendingAction = null;
    dialog.close();
  });
  confirmButton.addEventListener("click", () => {
    const action = pendingAction;
    pendingAction = null;
    confirmButton.disabled = true;
    dialog.close();
    action?.();
  });
}

export function askConfirm(title, text, label, action) {
  init();
  document.getElementById("shop-confirm-title").textContent = title;
  document.getElementById("shop-confirm-text").textContent = text;
  const confirmButton = document.getElementById("shop-confirm");
  confirmButton.textContent = label;
  confirmButton.disabled = false;
  pendingAction = action;
  document.getElementById("shop-confirm-dialog").showModal();
}
