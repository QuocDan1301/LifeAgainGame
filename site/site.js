import { isInstalledApp } from "../js/core/app-mode.js";

const get = (id) => document.getElementById(id);
const tabs = [...document.querySelectorAll('.device-picker [role="tab"]')];

function selectTab(tab, focus = false) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    get(item.getAttribute("aria-controls")).hidden = !selected;
  }
  if (focus) tab.focus();
}
for (const tab of tabs) tab.addEventListener("click", () => selectTab(tab));
document
  .querySelector(".device-picker")
  .addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = tabs.findIndex(
      (tab) => tab.getAttribute("aria-selected") === "true",
    );
    selectTab(tabs[(index + step + tabs.length) % tabs.length], true);
  });

const ua = navigator.userAgent;
const isIos =
  /iPhone|iPad|iPod/.test(ua) ||
  (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(ua);
const isWindows = /Windows NT/.test(ua);
if (isWindows)
  for (const link of document.querySelectorAll("[data-install-cta]"))
    link.textContent = "Tải game";
selectTab(get(isIos ? "tab-ios" : isAndroid ? "tab-android" : "tab-desktop"));

const standalone = isInstalledApp();
const gameUrl = new URL("./choi", location.href);
gameUrl.search = location.search;
get("transfer-pending").hidden = !new URL(location.href).searchParams.has(
  "nhan",
);
for (const link of document.querySelectorAll("[data-open-game]")) {
  link.href = gameUrl.href;
  link.hidden = !(standalone && (isIos || isAndroid));
}
get("install-ready").hidden = !(standalone && (isIos || isAndroid));

let installEvent = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installEvent = event;
  get("install-quick").hidden = standalone || isWindows;
});
get("install-button").addEventListener("click", async () => {
  if (!installEvent) return;
  const event = installEvent;
  installEvent = null;
  get("install-quick").hidden = true;
  try {
    await event.prompt();
    await event.userChoice;
  } catch {
    get("install-done").textContent =
      "Chưa cài được. Dùng menu trình duyệt theo hướng dẫn bên dưới.";
    get("install-done").hidden = false;
  }
});
window.addEventListener("appinstalled", () => {
  installEvent = null;
  get("install-quick").hidden = true;
  get("install-done").hidden = false;
  try {
    localStorage.setItem("lifeAgain:launchGame", "true");
  } catch {}
});

try {
  get("browser-backup").hidden = !Object.keys(localStorage).some(
    (key) =>
      /^lifeAgain[A-Za-z]+$/.test(key) && key !== "lifeAgainModuleRefresh",
  );
} catch {
  /* Instructions remain usable when storage is disabled. */
}
get("download-browser-backup").addEventListener("click", async () => {
  const status = get("browser-backup-status");
  try {
    const { createTransferPackage, backupFileName } =
      await import("../js/core/transfer.js");
    const blob = new Blob([JSON.stringify(createTransferPackage(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = backupFileName();
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent =
      "Đã tạo tệp sao lưu. Giữ tệp và nhập lại trong Chuyển thiết bị của ứng dụng.";
  } catch {
    status.textContent =
      "Chưa tạo được bản sao. Giữ nguyên dữ liệu trình duyệt và thử lại.";
  }
});

if (
  "serviceWorker" in navigator &&
  document.documentElement.hasAttribute("data-offline")
) {
  const register = () =>
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
