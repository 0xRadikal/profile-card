# Plan 007: Motion & interaction system

> **Executor instructions**: Follow step by step; run every verification.
> Honor STOP conditions. Update the 007 row in `plans/README.md` when done.

## Status

- **State**: DONE (implemented, tested `SMOKE OK`, 8 + reduced-motion screenshots, committed)
- **Priority**: P2
- **Effort**: M
- **Risk**: MED (touches `index.js` tilt + CSS animation durations; must not
  break the 15 runtime selectors or the CLI)
- **Depends on**: 005 (tokens)
- **Category**: motion / interaction
- **Planned at**: commit `2e21935`, branch `redesign/ui-ux`, 2026-07-13

## Why this matters

Current motion is un-orchestrated and, in one place, janky:

1. **3D tilt** (`index.js:54-63`) writes `cardEl.style.transform` on **every**
   `pointermove` — no smoothing, no RAF coalescing. On a large card this is
   jerky and fights the CSS `transform` used by the entrance `rise` animation.
   Best practice: sample the pointer, then interpolate toward the target with a
   `requestAnimationFrame` + lerp loop so motion is smooth and frame-bounded.
2. **Decorative loops** (orbs `float`, `scanline`, avatar `spin`, sparks,
   `card__glow spin`) all run at full intensity simultaneously → visually busy,
   the opposite of the "calm, disciplined" brief. They should be toned to a
   single restrained signature rather than a competing carnival.
3. **Reduced motion**: there IS a global `prefers-reduced-motion` block that
   zeroes animation/transition durations — good — but the JS tilt + JS particles
   must ALSO respect it (particles already do; the tilt does not gate on it).
4. **Page transitions**: navigation between the MPA pages is an abrupt reload.
   Cross-document **View Transitions** (`@view-transition{navigation:auto}`) add
   a smooth native fade as a pure progressive enhancement — browsers without
   support simply ignore it, and reduced-motion users get it disabled.
   (Sources: developer.chrome.com cross-document view transitions;
   css-tricks.com "Cross-Document View Transitions".)

## Current state

- `index.js:54-63` direct-write tilt; `:65-89` particles RAF loop (already
  gated on reduced-motion).
- CSS infinite animations: `.orb-* float 16-22s`, `.hud .scanline scan 8s`,
  `.avatar__ring spin 11s`, `.card__glow spin 14s`, `.s1-4 spark 5-7s`,
  `.led--* blink`. Global reduced-motion block at CSS end.
- `.card` has a `pointerleave` reset to `''`.
- Dead `data-depth` parallax: `.parallax` layers exist in index.html HUD
  (`data-depth="0.2"/"0.35"`) but the parallax handler lives only in
  `pages/projects.js`, NOT index.js — so on the home page those attributes do
  nothing. Decide: either wire a light home parallax or leave inert (leave
  inert — it is decorative and adding a global pointermove listener competes
  with the tilt; documented).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Smoke test | `npm test` | `SMOKE OK` |
| Screenshots | `node test/shots.mjs 007` | 8 PNGs |
| Reduced-motion shot | `node test/shot-reduced.mjs` | 1 PNG, no motion |

## Scope

**In scope**:
- `index.js`: replace the tilt with a RAF+lerp smoothed version that (a) reads
  pointer into a target, (b) lerps current→target each frame, (c) stops the loop
  on leave, (d) is fully skipped under `prefers-reduced-motion`.
- `profile-card.css`: tone down / orchestrate decorative loops (slower, lower
  opacity, fewer simultaneous focal points); keep one restrained signature.
  Standardize easing/duration via tokens (`--ease`, `--dur-*`).
- `profile-card.css`: add `@view-transition{navigation:auto}` + a subtle
  `::view-transition-*` fade, wrapped so reduced-motion disables it.

**Out of scope**: page-by-page component restyle (008), any data/HTML-contract
change. Do not remove decorative elements (008 may), only calm their motion.

## Git workflow

- Branch: `redesign/ui-ux`. Commit: `feat(motion): RAF+lerp tilt, orchestrated
  motion, View Transitions PE (Plan 007)`.

## Steps

1. Add motion tokens (`--ease`, `--dur-1/2/3`) to `:root`.
2. Rewrite `index.js` tilt: guard `matchMedia('(prefers-reduced-motion: reduce)')`;
   target vars updated on pointermove (passive), a RAF loop lerps and writes
   transform; pointerleave eases back to 0 then cancels RAF.
3. Calm decorative CSS: reduce orb opacity/animation intensity, slow scanline,
   drop `card__glow` opacity, keep avatar ring subtle. One signature = the
   terminal shell + a restrained scanline, not everything at once.
4. Add cross-document View Transitions rule + reduced-motion guard.

## Test plan

- `npm test` → `SMOKE OK`, 15 selectors intact, CLI `help` still outputs.
- 8 screenshots (fa/en × dark/light × mobile/desktop).
- Reduced-motion screenshot (emulate) — verify no transform jank / frozen art.
- Manual reasoning: tilt loop cancels on leave (no leaked RAF).

## Done criteria

- Tilt is smooth (RAF+lerp) and disabled under reduced-motion.
- Decorative motion is calmer/orchestrated; View Transitions PE added and
  reduced-motion-safe.
- Tests green; screenshots captured; 007 row DONE.

## STOP conditions

- If the tilt rewrite throws or the smoke test loses a selector / CLI output →
  revert to the previous tilt and note it.
- If View Transitions cause a console error in the smoke run → gate/remove it.
