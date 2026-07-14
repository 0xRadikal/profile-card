# Plan 005: Design token system + Persian/English typography

> **Executor instructions**: Follow step by step; run every verification.
> Honor STOP conditions. Update the 005 row in `plans/README.md` when done.
>
> This plan is the FOUNDATION of the frontend redesign (phases 005–009). It
> introduces the design-token layer and the self-hosted font system that all
> later phases build on. It does NOT touch runtime logic, security or data.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (touches the base of `profile-card.css` + every `<head>`)
- **Depends on**: none
- **Category**: design-system / typography
- **Planned at**: commit `5b57da5` (tag v8.1.0), branch `redesign/ui-ux`, 2026-07-13

## Why this matters

The site currently uses **Rubik** for Persian text (`body{font-family:Rubik…}`).
Rubik has no Persian/Arabic glyphs, so every Persian string silently falls back
to a system font — producing the inconsistent, unprofessional look the brief
calls out. The palette is the generic Web3 `#7c3aed` purple / `#06b6d4` cyan /
green triad with heavy blur — "generic glassmorphism" that fights the project's
real identity (terminal, node-ops, security, observability).

Fixing this at the **token** level (colors, spacing, radii, type scale as CSS
custom properties) means phases 006–008 can restyle components by referencing
tokens instead of hard-coded values, and dark/light stay in sync automatically.

## Current state

- `body` font: `Rubik, system-ui, …` → Persian falls back. (profile-card.css:20)
- Fonts loaded from **Google Fonts** (`fonts.googleapis.com`) in all 14 HTML
  `<head>`s; CSP allows `fonts.googleapis.com` (style-src) + `fonts.gstatic.com`
  (font-src).
- Palette tokens in `:root`: `--brandA #7c3aed`, `--brandB #06b6d4`,
  `--brandC` green, `--blur blur(12px)`, `--glass`, plus a purple SVG cursor.
- `.mono` = JetBrains Mono, but it is also applied to Persian spans
  (`.role.mono`, `.ens.mono`, `.blog-date.mono`, `.panel__list.mono`,
  `.contact-list.mono`) — Persian numerals/text rendered in a Latin mono face.
- No spacing / radius / type-scale tokens exist.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Smoke test | `npm test` | `SMOKE OK`, exit 0 |
| Serve for screenshots | `pm2 start ecosystem.config.cjs` then `curl -sI localhost:3000/profile-card/` | 200 |
| Grep Google Fonts refs | `grep -rl "fonts.googleapis" *.html en/*.html` | empty after step 4 |
| Confirm fonts present | `ls assets/fonts/*.woff2` | 8 files |

## Scope

**In scope**:
- New `assets/fonts/*.woff2` (Vazirmatn arabic+latin 400/500/700, JetBrains Mono
  latin 400/600) + OFL license files. (Already copied.)
- `@font-face` block + full token system (`--bg --surface --surface-2 --border
  --text --muted --accent --accent-soft --success --warning --danger`, spacing,
  radii, type scale) at the top of `profile-card.css`.
- Replace Rubik→Vazirmatn as the body font; keep `.mono` = JetBrains Mono but
  stop applying it to Persian prose (fix the mixed spans).
- Swap every HTML `<head>`: drop the Google Fonts `<link>` + preconnects, add a
  `preload` for the two most critical woff2 files.
- Tighten CSP: since fonts are now self-hosted, remove `https://fonts.googleapis.com`
  and `https://fonts.gstatic.com` from every page's CSP (a security improvement,
  synced across all 14 HTML files).
- `sw.js`: add the 8 woff2 + 2 license files to `ASSETS`, bump `CACHE` v4→v5.
- `manifest.json` + all `theme-color` metas: sync to the new base color.

**Out of scope**:
- Component-level layout / RTL logical properties (→ 006), motion (→ 007),
  page-by-page visual polish (→ 008). This phase only lands tokens + fonts +
  the minimal base rules so nothing regresses.
- `data/content.js`, `index.js` command logic, the 15 runtime selectors.

## Git workflow

- Branch: `redesign/ui-ux` (already created off `master`/v8.1.0).
- Commit: `feat(design): self-hosted Vazirmatn + design-token system (Plan 005)`.
- Push branch after verification + report.

## Steps

1. Copy Vazirmatn (arabic+latin, 400/500/700) + JetBrains Mono (400/600) woff2
   into `assets/fonts/`, plus both OFL licenses. **(done)**
2. Add `@font-face` rules (font-display:swap, unicode-range split so Persian
   uses the arabic subset and Latin uses the latin subset) at top of CSS.
3. Replace the `:root` palette with the observability token system; keep legacy
   aliases (`--brandA/B/C`, `--panel`, `--glass`) mapped onto new tokens so no
   component visually breaks before 006/008 restyle them. Add light-theme token
   overrides. Verify WCAG AA for text-on-bg pairs.
4. `body{font-family:var(--font-ui)}` (Vazirmatn); keep `.mono` for code only;
   remove `mono` class from Persian prose spans in HTML where it caused Latin
   rendering of Persian, OR neutralize by making `.mono` fall back to the UI
   font for non-ASCII — chosen approach: remove the class from the specific
   prose spans (documented in report) to keep `.mono` semantically "code only".
5. Update all 14 `<head>`s: remove Google Fonts link + preconnects, add woff2
   preloads, tighten CSP (drop googleapis/gstatic).
6. Update `sw.js` ASSETS (+fonts) & bump CACHE; sync `manifest.json` +
   `theme-color` metas to new `--bg`.

## Test plan

- `npm test` → `SMOKE OK`, zero CSP violations, all 15 selectors intact.
- Serve + Playwright screenshots: fa/en × dark/light × mobile/desktop (8 shots).
- Visual check: Persian renders in Vazirmatn (not fallback), CLI still mono.
- `prefers-reduced-motion` still honored (unchanged block).
- WCAG AA contrast spot-check on body text, muted text, accent buttons.

## Done criteria

- Persian text renders in self-hosted Vazirmatn on every page, both locales.
- No Google Fonts network dependency; CSP no longer lists font CDNs and still
  passes smoke with no violations.
- Token system in `:root` + light overrides; legacy aliases mapped so no
  component is visually broken pending 006/008.
- `sw.js` CACHE bumped + fonts precached; manifest/theme-color synced.
- Report written; branch pushed.

## STOP conditions

- If `npm test` reports a **CSP violation** or a missing runtime selector after
  changes → revert the offending edit, do not push.
- If removing the `mono` class from a span would change a value the smoke test
  asserts (needles: `Radikal`, `TON Validators`, `Security`, `CryptoPIA`) →
  keep the text, only change the class.
