import path from "node:path";

export const GAME_ORIGIN = "lifeagain://game.lifeagain";
export const GAME_URL = GAME_ORIGIN;
export const HOME_URL = "https://life-again-game.onrender.com/";
export const TRANSFER_PATHS = new Set(["/api/transfer", "/api/transfer/claim"]);

export function localFile(root, address) {
  const url = new URL(address);
  if (
    url.protocol !== "lifeagain:" ||
    url.host !== "game.lifeagain" ||
    url.username ||
    url.password
  )
    return null;
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  if (
    pathname.includes("\\") ||
    pathname.includes("\0") ||
    pathname.split("/").some((part) => part.startsWith("."))
  )
    return null;
  const page = ["/", "/choi", "/choi/"].includes(pathname)
    ? "/index.html"
    : pathname;
  const file = path.resolve(root, "." + page);
  const relative = path.relative(root, file);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative)
    ? file
    : null;
}

export function externalUrl(address) {
  try {
    const url = new URL(address);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
