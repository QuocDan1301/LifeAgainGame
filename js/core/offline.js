 
 
export function initOffline(isIdle, { beforeUpdate = () => {} } = {}) {
  const buttons = [...document.querySelectorAll("[data-game-update]")];
  const notices = [...document.querySelectorAll("[data-game-update-status]")];
  const supported = "serviceWorker" in navigator && document.documentElement.hasAttribute("data-offline");
  let registration;
  let updating = false;
  let reloaded = false;
  let controllerChanged = false;
  let available = false;
  const wasControlled = Boolean(navigator.serviceWorker?.controller);
  function show(message, busy = false) {
    for (const button of buttons) {
      button.disabled = busy || !supported;
      button.textContent = busy ? "Đang cập nhật…" : available ? "↻ Có bản mới — cập nhật ngay" : "↻ Cập nhật bản mới nhất";
    }
    for (const notice of notices) notice.textContent = message;
  }
  function reloadWhenIdle() {
    if (reloaded || updating || !controllerChanged || !isIdle()) return;
    reloaded = true;
    location.reload();
  }
  function offerUpdate() {
    if (!registration?.waiting || !navigator.serviceWorker.controller || updating) return;
    available = true;
    show("Có phiên bản mới. Bấm cập nhật để tải lại game; tiến trình của bạn được giữ nguyên.");
  }
  async function updateNow() {
    if (updating || !supported) return;
    updating = true;
    show("Đang kiểm tra kết nối và tải bản mới…", true);
    try {
      // The worker deliberately passes /health through to the network.
      // Verify connectivity before touching the offline cache.
      const response = await fetch(new URL("./health", document.baseURI), {
        cache: "no-store", signal: AbortSignal.timeout(15000),
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error("network");
      await beforeUpdate();
      // A distinct script URL forces a fresh install even if the browser retains
      // an unregistered worker whose files were just removed from Cache Storage.
      localStorage.setItem("lifeAgainWorkerRevision", String(Date.now()));
      const appScope = new URL("./", document.baseURI).href;
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const item of registrations) {
        if (item.scope === appScope && !(await item.unregister())) throw new Error("unregister");
      }
      // Recreate only the downloadable game files. Never touch localStorage,
      // IndexedDB, tickets, achievements or the saved life.
      if ("caches" in globalThis) {
        for (const key of await caches.keys()) {
          if (key.startsWith("life-again-")) await caches.delete(key);
        }
      }
      // Capture any progress made while the network/cache operations were pending.
      await beforeUpdate();
      reloaded = true;
      location.reload();
    } catch {
      updating = false;
      show("Chưa cập nhật được. Kiểm tra kết nối và bảo đảm game đã lưu, rồi bấm thử lại. Bản lưu vẫn được giữ nguyên.");
    }
  }
  for (const button of buttons) button.addEventListener("click", updateNow);
  show(supported ? "" : "Nút cập nhật khả dụng khi chơi bản game đã triển khai trực tuyến.");
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    controllerChanged = wasControlled;
    reloadWhenIdle();
  });
  async function register() {
    if (!document.documentElement.hasAttribute("data-offline")) {
      const registrations = await navigator.serviceWorker.getRegistrations().catch(() => []);
      const appScope = new URL("./", document.baseURI).href;
      let removed = false;
      for (const item of registrations) {
        if (item.scope === appScope) removed = (await item.unregister()) || removed;
      }
      if (removed && wasControlled) {
        controllerChanged = true;
        reloadWhenIdle();
        setInterval(reloadWhenIdle, 5000);
      }
      return;
    }
    try {
      let revision;
      try { revision = localStorage.getItem("lifeAgainWorkerRevision"); } catch { /* Storage can be unavailable. */ }
      const workerUrl = revision && /^\d+$/.test(revision) ? "./sw.js?refresh=" + revision : "./sw.js";
      registration = await navigator.serviceWorker.register(workerUrl, { updateViaCache: "none" });
    } catch {
      return;
    }
    if (!registration) return;
    function watch(worker) {
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed") offerUpdate();
      });
      if (worker.state === "installed") offerUpdate();
    }
    registration.addEventListener("updatefound", () => watch(registration.installing));
    watch(registration.installing);
    offerUpdate();
    let checking = false;
    async function checkUpdate() {
      if (checking || updating || document.visibilityState === "hidden") return;
      checking = true;
      try {
        await registration.update();
        offerUpdate();
      } catch {
        // Keep the cached game available when disconnected.
      } finally {
        checking = false;
      }
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkUpdate();
    });
    window.addEventListener("online", checkUpdate);
    window.addEventListener("focus", checkUpdate);
    checkUpdate();
    setInterval(checkUpdate, 60000);
    setInterval(() => {
      reloadWhenIdle();
      offerUpdate();
    }, 5000);
  }
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
