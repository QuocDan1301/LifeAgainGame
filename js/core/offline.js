// Chế độ offline: đăng ký service worker (chỉ bản build mới có sw.js) để game chạy khi không có mạng.
// Bản cập nhật tải xong thì chỉ đổi sang khi người chơi đang rảnh ở bến xe, rồi mở lại trang.
export function initOffline(isIdle) {
  if (!("serviceWorker" in navigator)) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) location.reload();
  });
  function activate(worker) {
    if (!worker || !navigator.serviceWorker.controller || reloading || !isIdle()) return;
    reloading = true;
    worker.postMessage("skip-waiting");
  }
  async function register() {
    // Bản phát triển (code gốc) không có sw.js: gỡ service worker cũ nếu có để luôn chạy code mới nhất.
    if (!document.documentElement.hasAttribute("data-offline")) {
      const registrations = await navigator.serviceWorker.getRegistrations().catch(() => []);
      for (const item of registrations) await item.unregister();
      return;
    }
    let registration;
    try {
      registration = await navigator.serviceWorker.register("./sw.js");
    } catch {
      return;
    }
    // Trình duyệt chặn service worker (chế độ riêng tư, chính sách công ty) thì bỏ qua.
    if (!registration) return;
    activate(registration.waiting);
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed") activate(worker);
      });
    });
    // Mở lại app từ nền: hỏi xem có bản mới không.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") registration.update().catch(() => {});
    });
    // Bản mới đang chờ vì người chơi còn trong ván: về bến xe thì đổi.
    setInterval(() => activate(registration.waiting), 30000);
  }
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
