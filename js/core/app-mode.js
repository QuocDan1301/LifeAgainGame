export function isInstalledApp({ navigator: nav = globalThis.navigator, matchMedia: media = globalThis.matchMedia } = {}) {
  return nav?.standalone === true || Boolean(media?.("(display-mode: standalone)").matches);
}

export function installationPage(location = globalThis.location) {
  const url = new URL("./gioi-thieu", location.href);
  url.search = location.search;
  url.hash = "cai-dat";
  return url.href;
}
