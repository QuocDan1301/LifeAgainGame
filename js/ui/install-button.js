 
 
export function initInstallButton() {
  const link = document.getElementById("install-link");
  let installEvent = null;
  addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installEvent = event;
  });
  addEventListener("appinstalled", () => {
    installEvent = null;
    link.hidden = true;
  });
  link.addEventListener("click", async event => {
    if (!installEvent) return;
    event.preventDefault();
    const pending = installEvent;
    installEvent = null;
    await pending.prompt();
    const { outcome } = await pending.userChoice;
    if (outcome === "accepted") link.hidden = true;
  });
}
