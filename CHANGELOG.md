# Changelog

## v8.1.0 – 2026-07-13
### Hardening & architecture (improve-skill implementation pass)
- **Tests:** Added a headless Playwright smoke test (`npm test`) that verifies
  the CLI runtime contract (all 15 DOM selectors), asserts zero console errors,
  and checks for CSP violations across every fa + en page. First automated
  test in the project.
- **Single source of truth:** All blog/skills/timeline/gallery content now
  lives once in `data/content.js` (locale-keyed), consumed by both the CLI and
  the page modules. Removed the ~6-way data duplication that risked drift.
- **No inline scripts:** Extracted every inline `<script>` into external ES
  modules under `pages/` (incl. a shared `theme.js` bootstrap that was
  duplicated on every page). `index.js` is now an ES module.
- **Content-Security-Policy:** Added a strict CSP (`script-src 'self'`) to all
  14 pages, closing the XSS class at the page level. Tight allow-list for
  fonts, images (incl. `avatars.githubusercontent.com`) and `api.github.com`.
- **Polish:** Fixed relative asset paths in `index.html`, added favicon links
  to all section pages (removes the `/favicon.ico` 404), unified version to
  v8.1.0.

## v8.0 – 2025-03-01
- Expanded CLI with blog, skills, social, contact, timeline, achievements, fetch, theme, and easter-egg commands.
- Added command suggestions, tab auto-complete, persistent history, and inline form handling.
- New pages: contact, blog, gallery, timeline, skills.
- Live GitHub stats, code snippet viewer, particle background, 3D tilt, toasts, and skeleton loaders.
- PWA manifest + Service Worker for offline cache.
- Updated documentation and accessibility (skip links, focus states).
