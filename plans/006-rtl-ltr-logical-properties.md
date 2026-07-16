# Plan 006: Full RTL/LTR audit + CSS logical properties

> **Executor instructions**: Follow step by step; run every verification.
> Honor STOP conditions. Update the 006 row in `plans/README.md` when done.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (mechanical property swaps; visual-parity in LTR, correctness in RTL)
- **Depends on**: 005 (tokens/fonts landed)
- **Category**: rtl-correctness / css
- **Planned at**: commit `0fcb911`, branch `redesign/ui-ux`, 2026-07-13

## Why this matters

The site ships two locales: `index.html` is `dir="rtl"` (Persian) and `en/` is
`dir="ltr"`. Several content-flow rules use **physical** `left/right`, so they
are correct in only one direction. The most visible defect is the **timeline**:
`padding-left:14px; border-left:2px dashed` pins the rail to the left in Persian
too, even though Persian reads right-to-left — the dots/line should sit on the
inline-start (right) side. CSS logical properties (`padding-inline-start`,
`border-inline-start`, `inset-inline-start`, `text-align:start/end`) map to the
correct physical side automatically based on `dir`, so one rule serves both.
(MDN: Logical properties and values; ishadeed.com "Digging into CSS logical
properties".)

Decorative layers (orbs, HUD corners, sparks, scanline) must NOT be flipped —
they are background art, not reading flow. The audit distinguishes the two.

## Current state

Content-flow physical props found (`grep -noE "…(left|right)…:" profile-card.css`,
minus decorative orb/hud/spark/scanline):

- `.skip` `left:12px` — skip link, should be inline-start.
- `.status` `right:10px` — avatar presence badge, content-flow → inline-end.
- `.link::after` `left:0;right:0` + `transform-origin:left` — underline sweep;
  origin should follow inline-start.
- `.chart__bar label` `left:50%` (centered) — symmetric, OK to leave.
- `.timeline` / `.timeline--inline` / `.timeline__item` / `::before`
  `padding-left` + `border-left` + `left:-16px` — **primary fix**, make logical.
- `.toast` `right:16px` — notification, direction-aware → inset-inline-end.

Decorative (leave physical): `.orb-*`, `.hud-corner.*`, `.s1..s4` sparks,
`.scanline`. JS: `index.js` uses `rect.left` (a geometry read, not a style
write — unaffected); `pages/projects.js` parallax writes `translate3d` (visual,
not direction — unaffected).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Smoke test | `npm test` | `SMOKE OK` |
| Re-audit physical props | `grep -noE "\b(left\|right)\s*:" profile-card.css` | only decorative + centered remain |
| Screenshots | `node test/shots.mjs 006` | 8 PNGs |

## Scope

**In scope**: `profile-card.css` content-flow rules → logical properties;
verify `text-align` uses `start/end` where meaningful; RTL timeline correctness.

**Out of scope**: decorative layers, motion (007), per-page visual restyle
(008), any HTML/JS behavior. No token changes.

## Git workflow

- Branch: `redesign/ui-ux`. Commit: `fix(rtl): use CSS logical properties for
  direction-aware layout (Plan 006)`.

## Steps

1. Timeline: `.timeline`/`.timeline--inline` → `padding-inline-start` +
   `border-inline-start`; `.timeline__item` `padding-inline-start`;
   `.timeline__item::before` → `inset-inline-start:-16px`.
2. `.skip` → `inset-inline-start`; `.status` → `inset-inline-end`;
   `.toast` → `inset-inline-end`.
3. `.link::after` → keep `inset-inline:0` and set `transform-origin` to the
   inline-start edge for both dirs (use `transform-origin: left` under `:dir(ltr)`
   is overkill — simpler: origin center or start; choose start via logical).
4. Leave decorative + centered rules physical (documented).

## Test plan

- `npm test` → `SMOKE OK`.
- Screenshots fa (RTL) + en (LTR): timeline rail on the **right** in fa, **left**
  in en; skip-link, status badge, toast on the correct inline side each way.
- Visual parity: LTR (en) must look identical to before (no regression).

## Done criteria

- Timeline and other content-flow elements are direction-correct in both fa/en.
- No physical `left/right` remains on content-flow rules (only decorative +
  intentionally-centered).
- `npm test` green; 8 screenshots captured.

## STOP conditions

- If a logical-property swap visibly regresses the LTR (en) layout → revert that
  one rule and note it. If `npm test` fails → fix before commit.
