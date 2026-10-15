 
 
 
const IMPORT_PATTERN = /(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}\/[^"']+\.js)["']/g;

export function refreshModuleCache(entries) {
  return crawlModules(entries, "reload");
}

 
export function warmModuleCache(entries) {
  return crawlModules(entries, "default");
}

async function crawlModules(entries, cache) {
  const seen = new Set();
  const queue = entries.map((entry) => new URL(entry, import.meta.url).href);
  while (queue.length) {
    const url = queue.pop();
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const response = await fetch(url, { cache, priority: "low" });
      if (!response.ok) continue;
      const source = await response.text();
      for (const match of source.matchAll(IMPORT_PATTERN)) queue.push(new URL(match[1], url).href);
    } catch {
       
    }
  }
  return seen.size;
}

const RETRY_KEY = "lifeAgainModuleRefresh";

 
export function canRetryModuleLoad() {
  try {
    if (sessionStorage.getItem(RETRY_KEY)) return false;
    sessionStorage.setItem(RETRY_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function clearModuleRetry() {
  try {
    sessionStorage.removeItem(RETRY_KEY);
  } catch {
     
  }
}
