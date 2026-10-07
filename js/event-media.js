import { eventMedia } from "./event-media-data.js";

const stickerUrl = (code) =>
  new URL(`./img/events/stickers/${code}.svg`, import.meta.url).href;

export function applyEventMedia(eventsByAge) {
  for (const event of Object.values(eventsByAge).flat()) {
    const media = eventMedia[event.id];
    if (!media) continue;
    event.image = stickerUrl(media.scene.code);
    event.imageAlt = `Nhãn dán minh họa: ${media.scene.alt}`;
    event.choices.forEach((choice, index) => {
      const illustration = media.choices[index];
      if (!illustration) return;
      choice.image = stickerUrl(illustration.code);
      choice.imageAlt = `Nhãn dán minh họa lựa chọn: ${choice.label}`;
    });
  }
}
