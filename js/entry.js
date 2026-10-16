import { isInstalledApp, installationPage } from "./core/app-mode.js";

const mobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
const desktopApp = location.protocol === "lifeagain:";
if (!desktopApp && !(mobile && isInstalledApp())) {
  location.replace(installationPage());
} else {
try { localStorage.setItem("lifeAgain:launchGame", "true"); } catch {}

import("./boot.js").catch(error => {
  window.appLoader?.hide();
  const message = document.getElementById("lobby-message");
  if (message) message.textContent = "Chưa tải được game. Kiểm tra mạng rồi mở lại ứng dụng.";
  console.error(error);
});
}
