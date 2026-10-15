 
 
 
 
const CLOSE_BUTTONS = [
  ".dialog-close", "#close-activities", "#close-achievements",
  "#close-tickets", "#close-create-character", "#close-random-gender",
].join(", ");

 
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

 
export const scrollerOf = (dialog) => dialog.querySelector(":scope > .dialog-scroll") ?? dialog;
