import { findGiphyGif } from "./event-gifs.js";

export function createEventImageRenderer(image, motionPreference) {
  let loadTimeout;
  let renderVersion = 0;

  return function renderEventImage(src, alt = "", fallback = "", fallbackAlt = "") {
    const version = ++renderVersion;
    clearTimeout(loadTimeout);
    image.onload = null;
    image.onerror = null;
    delete image.dataset.motion;
    const gif = findGiphyGif(src);

    // GIF animation cannot be paused with CSS; use the local sticker instead.
    if (gif && motionPreference.matches) {
      src = fallback;
      alt = fallbackAlt;
    }
    image.hidden = !src;
    image.alt = alt;
    if (!src) {
      image.removeAttribute("src");
      return;
    }

    const showFallback = () => {
      if (version !== renderVersion) return;
      renderEventImage(fallback !== src ? fallback : "", fallbackAlt);
    };
    image.onerror = showFallback;
    image.onload = () => {
      if (version !== renderVersion) return;
      clearTimeout(loadTimeout);
    };
    image.src = src;
    if (gif && src === gif.url) {
      // Slow or unavailable remote media must not leave an empty event panel.
      loadTimeout = setTimeout(showFallback, 8000);
    }
    if (src.includes("/events/stickers/")) {
      const motions = ["bounce", "sway", "float"];
      const variant = Array.from(src).reduce(
        (sum, character) => sum + character.charCodeAt(0), 0,
      );
      void image.offsetWidth;
      image.dataset.motion = motions[variant % motions.length];
    }
  };
}
