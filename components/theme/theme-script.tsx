export const THEME_STORAGE_KEY = "techenzo-theme";

/**
 * Runs before first paint so a stored theme never flashes the other one.
 * Kept as a string rather than a real module because it must execute
 * synchronously in <head>, ahead of hydration.
 *
 * This is the only inline script we author. It carries the per-request nonce
 * from middleware.ts, which is what lets `script-src` ship without
 * `'unsafe-inline'` (spec §13).
 */
const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export function ThemeScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: script }} />;
}
