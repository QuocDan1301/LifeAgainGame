import { resolveOpenMojiCode } from './event-openmoji.js';

export function openMojiArt(code, description) {
  code = resolveOpenMojiCode(code);
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  const imageAlt = `OpenMoji: ${description}`;
  return { image, imageAlt, imageFallback: image, imageFallbackAlt: imageAlt };
}
