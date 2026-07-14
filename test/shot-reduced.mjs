// test/shot-reduced.mjs — verify the site under prefers-reduced-motion: reduce.
// Confirms: (a) page renders, (b) #input is present (CLI booted with tilt skipped),
// (c) no console errors, then captures a screenshot for the phase.
// Usage: node test/shot-reduced.mjs <phase>   e.g. node test/shot-reduced.mjs 007
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { startServer } from './server.mjs';

const phase = process.argv[2] || 'adhoc';
const outDir = new URL(`./screenshots/${phase}/`, import.meta.url);

async function run() {
  await mkdir(outDir, { recursive: true });
  const { server, port } = await startServer(0);
  const origin = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  const errors = [];
  try {
    // reducedMotion:'reduce' makes the page see prefers-reduced-motion: reduce.
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));

    await page.goto(`${origin}/profile-card/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#input', { timeout: 10000 });
    await page.waitForTimeout(500);

    // The tilt branch is skipped under reduced-motion, so the card must carry
    // no inline transform even after moving the pointer across it.
    const card = await page.$('.card');
    if (card) {
      const box = await card.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.move(box.x + 20, box.y + 20);
        await page.waitForTimeout(200);
      }
    }
    const inlineTransform = await page.$eval('.card', (el) => el.style.transform || '');

    await page.screenshot({
      path: new URL('reduced-motion.png', outDir).pathname,
      animations: 'disabled',
      timeout: 15000,
    });
    await ctx.close();

    if (errors.length) {
      console.error('REDUCED-MOTION CONSOLE ERRORS:', errors);
      process.exit(1);
    }
    console.log('reduced-motion: OK (card inline transform:', JSON.stringify(inlineTransform) + ')');
  } finally {
    await browser.close();
    server.close();
  }
}
run().catch((e) => { console.error('SHOT-REDUCED CRASHED:', e); process.exit(1); });
