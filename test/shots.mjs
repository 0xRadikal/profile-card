// test/shots.mjs — capture the 8 verification screenshots for a redesign phase.
//   fa/en × dark/light × mobile/desktop
// Usage: node test/shots.mjs <phase>   e.g. node test/shots.mjs 005
// Writes to test/screenshots/<phase>/<name>.png
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { startServer } from './server.mjs';

const phase = process.argv[2] || 'adhoc';
const outDir = new URL(`./screenshots/${phase}/`, import.meta.url);

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },   // iPhone 12-ish
  desktop: { width: 1280, height: 900 },
};
const LOCALES = {
  fa: '/profile-card/',
  en: '/profile-card/en/index.html',
};
const THEMES = ['dark', 'light'];

async function run() {
  await mkdir(outDir, { recursive: true });
  const { server, port } = await startServer(0);
  const origin = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  try {
    for (const [loc, path] of Object.entries(LOCALES)) {
      for (const theme of THEMES) {
        for (const [vp, size] of Object.entries(VIEWPORTS)) {
          const ctx = await browser.newContext({
            viewport: size,
            colorScheme: theme,
          });
          const page = await ctx.newPage();
          // Force the theme deterministically before any script runs.
          await page.addInitScript((t) => {
            try { localStorage.setItem('theme', t); } catch (_) {}
          }, theme);
          await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' });
          await page.waitForSelector('#input', { timeout: 10000 });
          await page.waitForTimeout(700); // let fonts + first paint settle
          const name = `${loc}-${theme}-${vp}.png`;
          // animations:'disabled' freezes the infinite CSS/RAF loops so the
          // screenshot resolves instead of waiting forever for stability.
          await page.screenshot({
            path: new URL(name, outDir).pathname,
            animations: 'disabled',
            timeout: 15000,
          });
          await ctx.close();
          console.log('shot', name);
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
}
run().catch((e) => { console.error('SHOTS CRASHED:', e); process.exit(1); });
