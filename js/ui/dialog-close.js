// Đưa nút ✕ của mọi popup ra ngoài khung, đè lên góc trên bên phải.
// Khung popup tự cuộn nên mọi thứ thò ra ngoài đều bị cắt; vì vậy nội dung được bọc vào
// .dialog-scroll (lớp này cuộn, nhận đúng khoảng đệm cũ của popup) còn khung popup thì không cuộn,
// và nút ✕ trở thành con trực tiếp của khung để đặt ra ngoài góc.
const CLOSE_BUTTONS = [
  ".dialog-close", "#close-activities", "#close-achievements",
  "#close-tickets", "#close-create-character", "#close-random-gender",
].join(", ");

// Khoảng đệm của popup đổi theo màn hình (máy tính / điện thoại): đọc lại từ CSS rồi chuyển vào lớp cuộn.
function syncPadding(dialog) {
  const scroll = dialog.querySelector(":scope > .dialog-scroll");
  if (!scroll) return;
  dialog.style.removeProperty("padding");
  const style = getComputedStyle(dialog);
  scroll.style.padding = `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
  dialog.style.setProperty("padding", "0", "important");
}

export function moveCloseButtonsOutside(root = document) {
  const dialogs = [];
  for (const dialog of root.querySelectorAll("dialog:not(.has-corner-close)")) {
    const close = dialog.querySelector(CLOSE_BUTTONS);
    if (!close) continue;
    const scroll = document.createElement("div");
    scroll.className = "dialog-scroll";
    scroll.append(...dialog.childNodes);
    // Nút ✕ đứng đầu để thứ tự Tab như cũ (trước đây nó nằm ở thanh tiêu đề, trên cùng).
    dialog.replaceChildren(close, scroll);
    close.classList.add("dialog-corner-close");
    dialog.classList.add("has-corner-close");
    syncPadding(dialog);
    dialogs.push(dialog);
  }
  if (dialogs.length) {
    addEventListener("resize", () => dialogs.forEach(syncPadding));
  }
  return dialogs.length;
}

// Popup đã bọc thì phần cuộn là .dialog-scroll; popup khác vẫn tự cuộn.
export const scrollerOf = (dialog) => dialog.querySelector(":scope > .dialog-scroll") ?? dialog;
