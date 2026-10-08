import { eventMedia } from "./event-media-data.js";
import { eventGifs, getEventGif, mixEventMedia } from "./event-gifs.js";

const stickerUrl = (code) =>
  new URL(`./img/events/stickers/${code}.svg`, import.meta.url).href;

function setIllustration(target, sticker, gifKey) {
  const illustration = getEventGif(gifKey, target);
  target.imageFallback = stickerUrl(sticker.code);
  target.imageFallbackAlt = `Nhãn dán minh họa: ${sticker.alt}`;
  target.image = illustration?.url ?? target.imageFallback;
  target.imageAlt = illustration?.alt ?? target.imageFallbackAlt;
}

export function applyEventMedia(eventsByAge) {
  for (const event of Object.values(eventsByAge).flat()) {
    const media = eventMedia[event.id];
    if (!media) continue;
    const gifs = eventGifs[event.id];
    setIllustration(event, media.scene, gifs?.scene);
    event.choices.forEach((choice, index) => {
      const illustration = media.choices[index];
      if (!illustration) return;
      setIllustration(choice, illustration, gifs?.choices?.[index]);
    });
    mixEventMedia(event);
  }
}
