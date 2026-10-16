export function isInstalledApp({ navigator: nav = globalThis.navigator, matchMedia: media = globalThis.matchMedia } = {}) {
  return nav?.standalone === true || ["standalone", "minimal-ui", "window-controls-overlay"]
    .some(mode => Boolean(media?.(`(display-mode: ${mode})`).matches));
}

export function installationPage(location = globalThis.location) {
  const url = new URL("./caigame.html", location.href);
  url.search = location.search;
  url.hash = "cai-dat";
  return url.href;
}
