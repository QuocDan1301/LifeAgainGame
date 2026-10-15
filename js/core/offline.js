 
 
export function initOffline(isIdle) {
  if (!("serviceWorker" in navigator)) return;
  let reloading = false;
  let controllerChanged = false;
  const wasControlled = Boolean(navigator.serviceWorker.controller);
  function reloadWhenIdle() {
    if (!controllerChanged || !isIdle()) return;
    reloading = true;
    location.reload();
  }
  navigator.serviceWorker.addEventListener("controllerchange", () => {
     
    controllerChanged = wasControlled || reloading;
    reloadWhenIdle();
  });
  function activate(worker) {
    if (!worker || !navigator.serviceWorker.controller || reloading || !isIdle()) return;
    reloading = true;
    worker.postMessage("skip-waiting");
  }
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
    let registration;
    try {
      registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
    } catch {
      return;
    }
    if (!registration) return;
    function watch(worker) {
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed") activate(worker);
      });
      if (worker.state === "installed") activate(worker);
    }
    registration.addEventListener("updatefound", () => watch(registration.installing));
    watch(registration.installing);
    activate(registration.waiting);
    let checking = false;
    async function checkUpdate() {
      if (checking || document.visibilityState === "hidden") return;
      checking = true;
      try {
        await registration.update();
        activate(registration.waiting);
      } catch {
         
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
      activate(registration.waiting);
    }, 5000);
  }
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
