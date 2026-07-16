# Plan 009: Final PWA sync + full verification

> **Executor instructions**: Follow step by step; run every verification.
> Honor STOP conditions. Update the 009 row in `plans/README.md` when done.
>
> Closing phase of the frontend redesign (005–009). Ensures the PWA serves the
> redesigned assets to returning users, then runs the full cross-theme /
> locale / viewport verification and updates project docs. Visual/PWA layer
> only: no runtime logic, security, or data changes.

## Status

- **State**: DONE (CACHE v6, ASSETS verified complete, SMOKE OK, v8.2.0)
- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (cache-version bump + docs; no component/logic change)
- **Depends on**: 008
- **Category**: PWA / verification / docs
- **Planned at**: after 008 (commit 47c18ee)

## Why this matters

Phases 005–008 changed the *content* of `profile-card.css`, `index.js`, and
every `<head>` (fonts/CSP), but the shipped asset *paths* are unchanged, so the
service worker's precache list is already complete (fonts were added in 005).
However, a returning PWA visitor holding `profile-card-v5` in cache would keep
serving the OLD css/js. Bumping `CACHE` to `v6` forces the SW `activate`
handler to purge the stale cache and re-precache the redesigned assets.

Base theme color (`#0b0f14`) has NOT changed since 005, so manifest.json and
the `<meta name="theme-color">` on both index pages need no change — verified.

## Current state (audited)

- `sw.js`: `CACHE='profile-card-v5'`; ASSETS lists all 8 fonts + all HTML +
  page modules + css/js/content/manifest. Complete — no new runtime file added
  by 006–008 (shot-reduced.mjs is test-only, never shipped).
- theme-color: `#0b0f14` in manifest (theme+bg) and index.html / en/index.html.
  Section pages carry no theme-color meta — pre-existing baseline, left as-is.

## Commands

- Test: `npm test` (expect `SMOKE OK`)
- Screenshots: `node test/shots.mjs 009` + `node test/shot-reduced.mjs 009`

## Scope

**In**: bump `sw.js` CACHE v5→v6; confirm ASSETS complete; confirm theme-color
sync; final full verification (all themes/locales/viewports); update README.md
+ CHANGELOG.md; version bump 8.1.0→8.2.0.

**Out**: any component/layout/logic/data/CSP change; new assets.

## Git workflow

- Branch: `redesign/ui-ux`. One commit. Then push + open PR/merge to `master`.

## Steps

1. Bump `sw.js` CACHE `profile-card-v5` → `profile-card-v6`.
2. Re-verify ASSETS list is complete vs shipped files.
3. Confirm theme-color / manifest sync (no change expected).
4. `npm test` → SMOKE OK; capture 8 + reduced-motion screenshots.
5. Bump version 8.1.0 → 8.2.0 (package.json + CLI boot string if present).
6. Update README.md (redesign summary) + CHANGELOG.md (005–009 entry).
7. Commit, push branch, open PR / merge to master.

## Test plan

- `npm test` → `SMOKE OK` (15 selectors + no CSP violation + no console error)
- 8 screenshots fa/en × dark/light × mobile/desktop + reduced-motion
- Verify sw.js parses (node --check) and CACHE bumped
- Verify no shipped asset missing from ASSETS

## Done criteria

- CACHE bumped, ASSETS complete, theme-color synced
- SMOKE OK, selectors intact, CSP unchanged
- README + CHANGELOG updated, version 8.2.0
- Branch pushed, PR/merge to master
- plans/README 009 row → DONE

## STOP conditions

- If bumping CACHE breaks the smoke run → revert, note it.
- If an asset is found missing from ASSETS → add it before shipping.
