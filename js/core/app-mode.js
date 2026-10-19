export function isInstalledApp({ navigator: nav = globalThis.navigator, matchMedia: media = globalThis.matchMedia } = {}) {
  return nav?.standalone === true || ["standalone", "minimal-ui", "window-controls-overlay"]
    .some(mode => Boolean(media?.(`(display-mode: ${mode})`).matches));
}

// Live Server and `npm start` serve the source on this machine or the LAN.
// Published builds mark <html data-offline>, so they always keep the download page.
export function isLocalPreview({ location: loc = globalThis.location, document: doc = globalThis.document } = {}) {
  const host = String(loc?.hostname ?? "").toLowerCase();
  return /^(localhost|127(\.\d+){3}|10(\.\d+){3}|192\.168(\.\d+){2}|\[::1\])$/.test(host) &&
    doc?.documentElement?.hasAttribute("data-offline") !== true;
}

export function installationPage(location = globalThis.location) {
  const url = new URL("./caigame.html", location.href);
  url.search = location.search;
  url.hash = "cai-dat";
  return url.href;
}
