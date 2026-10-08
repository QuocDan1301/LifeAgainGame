export function openMojiArt(code, description) {
  const image = new URL(`./img/events/stickers/${code}.svg`, import.meta.url).href;
  const imageAlt = `OpenMoji: ${description}`;
  return { image, imageAlt, imageFallback: image, imageFallbackAlt: imageAlt };
}
