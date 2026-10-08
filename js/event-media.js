import { eventMedia } from "./event-media-data.js";
import { ensureEventGif } from "./event-gifs.js";

const stickerUrl = (code) =>
  new URL(`./img/events/stickers/${code}.svg`, import.meta.url).href;

function setIllustration(target, sticker) {
  target.imageFallback = stickerUrl(sticker.code);
  target.imageFallbackAlt = `Nhãn dán minh họa: ${sticker.alt}`;
  target.image = target.imageFallback;
  target.imageAlt = target.imageFallbackAlt;
}

export function applyEventMedia(eventsByAge) {
  for (const event of Object.values(eventsByAge).flat()) {
    const media = eventMedia[event.id];
    if (!media) continue;
    setIllustration(event, media.scene);
    event.choices.forEach((choice, index) => {
      const illustration = media.choices[index];
      if (!illustration) return;
      setIllustration(choice, illustration);
      ensureEventGif(choice);
    });
  }
}
