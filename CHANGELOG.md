# Changelog

## v8.2.0 – 2026-07-13
### Frontend / UI-UX / Motion redesign (visual layer only — no logic/security/data change)
- **Design tokens & typography (Plan 005):** Introduced a full design-token
  system (color, spacing, radius, type scale, elevation) in `:root` with light
  overrides. Self-hosted **Vazirmatn** (SIL OFL) for Persian/English and
  **JetBrains Mono** for code/CLI as `woff2`, split by `unicode-range` —
  replacing the CDN Google Font. Tightened CSP (removed the Google Fonts
  domains) now that fonts are local. Fixed Persian prose that was wrongly
  rendered in the monospace face.
- **RTL/LTR correctness (Plan 006):** Migrated directional layout
  (timeline, skip-link, status dot, toast, underline) to CSS **logical
  properties** (`inset-inline-*`, `padding-inline-*`, `:dir()` transform-origin)
  so the same rules render correctly in fa (RTL) and en (LTR).
- **Motion system (Plan 007):** Rewrote the 3D card tilt as a smoothed
  **RAF + lerp** loop, fully disabled under `prefers-reduced-motion`; calmed the
  decorative animation (fainter/slower orbs, scanline, glow, avatar ring); added
  cross-document **View Transitions** as a progressive enhancement (restrained
  cross-fade, neutralized under reduced-motion). Added `--ease` / `--dur-*`
  motion tokens.
- **Visual retokenization (Plan 008):** Retired the generic green→cyan gradients
  and leftover purple (`#7c3aed` / `rgba(124,58,237,…)`) glow from
  chips/buttons/pills/toast/badges/progress/chart to the accent-token family.
  Added a WCAG-AA `--link` token and fixed the `Radikal.eth` link, which was a
  hardcoded light purple failing AA (1.84:1) on the light theme
  (now 5.1:1 light / 10.2:1 dark).
- **PWA sync (Plan 009):** Bumped Service Worker cache `v5 → v6` so returning
  installs pick up the redesigned assets; verified the precache list covers
  every shipped file and that theme-color/manifest stay in sync.
- **Verification:** `npm test` (`SMOKE OK`) green throughout — 15 runtime
  selectors intact, zero console errors, no CSP violations. Real-browser
  screenshots captured for every phase across fa/en × dark/light ×
  mobile/desktop plus a dedicated reduced-motion check.

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
