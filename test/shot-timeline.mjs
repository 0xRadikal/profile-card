import { chromium } from 'playwright';
import { startServer } from './server.mjs';
const { server, port } = await startServer(0);
const b = await chromium.launch();
for (const [loc, path] of [['fa', '/profile-card/timeline.html'], ['en', '/profile-card/en/timeline.html']]) {
  const ctx = await b.newContext({ viewport: { width: 900, height: 800 }, colorScheme: 'dark' });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(700);
  await p.screenshot({ path: new URL(`./screenshots/006/timeline-${loc}.png`, import.meta.url).pathname, animations: 'disabled' });
  await ctx.close();
  console.log('shot timeline-' + loc);
}
await b.close();
server.close();
