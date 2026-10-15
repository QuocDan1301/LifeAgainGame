 
 
const get = id => document.getElementById(id);
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
document.querySelector(".device-picker").addEventListener("keydown", event => {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
  if (!step) return;
  event.preventDefault();
  const index = tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true");
  selectTab(tabs[(index + step + tabs.length) % tabs.length], true);
});

 
const ua = navigator.userAgent;
const isIos = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(ua);
selectTab(get(isIos ? "tab-ios" : isAndroid ? "tab-android" : "tab-desktop"));

const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
get("install-ready").hidden = !standalone;

let installEvent = null;
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installEvent = event;
  get("install-quick").hidden = standalone;
});
get("install-button").addEventListener("click", async () => {
  if (!installEvent) return;
  const event = installEvent;
  installEvent = null;
  await event.prompt();
  const { outcome } = await event.userChoice;
  if (outcome === "accepted") get("install-quick").hidden = true;
});
window.addEventListener("appinstalled", () => {
  get("install-quick").hidden = true;
  get("install-done").hidden = false;
});

 
if ("serviceWorker" in navigator && document.documentElement.hasAttribute("data-offline")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }, { once: true });
}
