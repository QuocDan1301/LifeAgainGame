// Desktop shortcuts can open a normal browser tab instead of a standalone window.
// The play URL must work in either mode.
try { localStorage.setItem("lifeAgain:launchGame", "true"); } catch {}

import("./boot.js").catch(error => {
  window.appLoader?.hide();
  const message = document.getElementById("lobby-message");
  if (message) message.textContent = "Chưa tải được game. Kiểm tra mạng rồi mở lại ứng dụng.";
  console.error(error);
});
