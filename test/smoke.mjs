// Headless smoke test for the Radikal profile-card site.
//
// Guarantees enforced (see plans/001-cli-smoke-test.md):
//   1. Every page loads with ZERO console errors and ZERO page errors.
//   2. Every DOM id/selector that index.js queries at load exists on the
//      home page (the "runtime contract"). A renamed/removed id would
//      otherwise break the CLI silently.
//   3. Running `help` in the CLI appends output.
//   4. Section pages (blog/skills/timeline/gallery/contact/projects) render
//      their dynamic content (proves the externalised page modules work).
//   5. No Content-Security-Policy violations are logged (proves plan 003).
//
// Exits 0 and prints `SMOKE OK` on success; prints the failure and exits 1.
import { chromium } from 'playwright';
import { startServer } from './server.mjs';

// The 15 selectors index.js reads on module load (index.js:11-24,27).
const CONTRACT_SELECTORS = [
  '#output', '#input', '#helpBtn', '#clearBtn', '#muteBtn', '#suggestions',
  '#toast', '.card', '#starsLive', '#commitLive', '#snippetCode',
  '#copySnippet', '#particles', '#themeToggle', '#contact form.card-form',
];

// Page -> a substring that MUST appear in the rendered DOM once its module runs.
const PAGE_RENDER_CHECKS = [
  { path: '/profile-card/', needle: 'Radikal' },
  { path: '/profile-card/blog.html', needle: 'TON Validators' },
  { path: '/profile-card/skills.html', needle: 'Security' },
  { path: '/profile-card/timeline.html', needle: 'CryptoPIA' },
  { path: '/profile-card/gallery.html', needle: 'img' },
  { path: '/profile-card/contact.html', needle: 'form' },
  { path: '/profile-card/projects.html', needle: 'proj' },
  // English mirrors.
  { path: '/profile-card/en/index.html', needle: 'Radikal' },
  { path: '/profile-card/en/blog.html', needle: 'TON Validators' },
];

const errors = [];
function fail(msg) { errors.push(msg); }

// Errors we intentionally ignore: the sandbox has no outbound network, so the
// Google Fonts stylesheet and remote avatar/unsplash images fail to load. Those
// are environmental, NOT defects in the site. A real CSP violation ("Refused
// to ... because it violates ... Content Security Policy") is always kept.
const IGNORABLE = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'images.unsplash.com',
  'github.com/0xradikal',
  'api.github.com',
  'ERR_NAME_NOT_RESOLVED',
  'ERR_INTERNET_DISCONNECTED',
  'net::ERR',
  'Failed to load resource',
];
function isIgnorable(text) {
  if (/content security policy|refused to/i.test(text)) return false; // never ignore CSP
  return IGNORABLE.some((frag) => text.includes(frag));
}

function attachListeners(page, label) {
  const local = [];
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const t = m.text();
      if (!isIgnorable(t)) local.push(`[console.error @ ${label}] ${t}`);
    }
  });
  page.on('pageerror', (e) => local.push(`[pageerror @ ${label}] ${e.message}`));
  return local;
}

async function run() {
  const { server, port } = await startServer(0);
  const origin = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  try {
    // --- Home page: console cleanliness + runtime contract + `help` ---
    {
      const page = await browser.newPage();
      const logs = attachListeners(page, '/profile-card/');
      await page.goto(`${origin}/profile-card/`, { waitUntil: 'domcontentloaded' });
      // Wait for the module to have run (CLI input becomes enabled after boot,
      // or at minimum the element exists). Do not wait on external fonts.
      await page.waitForSelector('#input', { timeout: 10000 });

      for (const sel of CONTRACT_SELECTORS) {
        const count = await page.locator(sel).count();
        if (count < 1) fail(`Runtime contract broken: selector "${sel}" not found on home page`);
      }

      // Run the CLI `help` command and assert output grows.
      const before = await page.locator('#output > *').count();
      await page.locator('#input').fill('help');
      await page.locator('#input').press('Enter');
      await page.waitForTimeout(300);
      const after = await page.locator('#output > *').count();
      if (after <= before) fail(`CLI "help" produced no output (before=${before}, after=${after})`);

      logs.forEach(fail);
      await page.close();
    }

    // --- All pages: console + CSP cleanliness + render check ---
    for (const { path, needle } of PAGE_RENDER_CHECKS) {
      const page = await browser.newPage();
      const logs = attachListeners(page, path);
      await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' });
      // Give module scripts time to import + render (they are deferred).
      await page.waitForTimeout(600);
      const html = await page.content();
      if (!html.includes(needle)) {
        fail(`Page ${path} did not render expected content "${needle}"`);
      }
      // Any CSP violation surfaces as a console error containing these tokens.
      logs.forEach((l) => {
        fail(l);
      });
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (errors.length) {
    console.error('SMOKE FAILED:\n' + errors.map((e) => '  - ' + e).join('\n'));
    process.exit(1);
  }
  console.log('SMOKE OK');
  process.exit(0);
}

run().catch((e) => { console.error('SMOKE CRASHED:', e); process.exit(1); });
