import { isInstalledApp, installationPage } from "./core/app-mode.js";

// Installation is a product flow, not authentication or source-code protection.
if (document.documentElement.hasAttribute("data-installed-only") && !isInstalledApp()) {
  location.replace(installationPage());
} else {
  import("./boot.js").catch(error => {
    window.appLoader?.hide();
    const message = document.getElementById("lobby-message");
    if (message) message.textContent = "Chưa tải được game. Kiểm tra mạng rồi mở lại ứng dụng.";
    console.error(error);
  });
}
