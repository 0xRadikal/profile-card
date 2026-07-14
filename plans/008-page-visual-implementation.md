# Plan 008: Page-by-page visual implementation

> **Executor instructions**: Follow step by step; run every verification.
> Honor STOP conditions. Update the 008 row in `plans/README.md` when done.
>
> This phase applies the token system (005) + logical properties (006) +
> motion system (007) to the actual component surfaces across every page,
> fa and en. It is a VISUAL layer only: no runtime logic, security, or data
> changes. The 15 runtime selectors and CSP stay intact.

## Status

- **State**: DONE (implemented, tested SMOKE OK, AA verified, screenshots)
- **Priority**: P1
- **Effort**: L
- **Risk**: MED (touches many component rules in `profile-card.css`; visual regressions possible)
- **Depends on**: 005, 006, 007
- **Category**: visual / UX
- **Planned at**: after 007 (commit e2d73cf)

## Why this matters

The token + type + motion foundation is in place, but the actual components
still wear the pre-redesign skin: the persona chips and primary buttons use a
green→cyan `--brandA/--brandB` gradient, and many hover states still carry
`rgba(124,58,237,…)` (purple) glow — a leftover generic-Web3 accent that no
longer matches the palette. The `.ens` link (`Radikal.eth`) is a hardcoded
`#a5b4fc` light purple that fails WCAG AA on the light theme and is weak on
dark. This phase retires those relics to the accent tokens and fixes the link
contrast, so the whole surface reads as one cohesive, calm, premium system.

## Current state (audited)

- `.ens` → hardcoded `color:#a5b4fc` (line ~205). Low contrast, off-palette.
- `.chip`, `.btn--primary`, `.pill`, `.toast`, `.badge-list .chip`,
  `.progress__bar`, `.chart__bar` → green→cyan gradients via `--brandA/--brandB`.
- Purple relic shadows: `.chip:hover`, `.btn--primary:hover`, `.pill-link:hover`,
  `.pill-link:focus-visible` note, `rgba(124,58,237,…)`.
- `.led--sec` → hardcoded `#7c3aed` purple.
- Hardcoded ink `#0b1626` on pill/toast/skip instead of `--on-accent`.

## Commands

- Test: `npm test` (expect `SMOKE OK`)
- Screenshots: `node test/shots.mjs 008` and `node test/shot-reduced.mjs 008`

## Scope

**In**: color/token retirement on chip/button/pill/toast/badge/progress/chart,
`.ens` link contrast token, `.led--sec` token, replace hardcoded ink with
`--on-accent`, purple relic shadow cleanup. Applies to shared `profile-card.css`
(covers every fa + en page since all import it).

**Out**: layout/DOM changes, HTML restructuring, runtime JS logic, new fonts,
CSP, data. No new selectors removed/added.

## Git workflow

- Branch: `redesign/ui-ux` (current)
- One commit for the visual retokenization.

## Steps

1. Add a `--link` token (accent-2 based, AA-safe on both themes) to `:root`
   and the light override; point `.ens` at it.
2. Retire chip/button/pill/toast/badge/progress/chart gradients from
   `--brandA→--brandB` to an accent-based scheme (`--accent`→`--accent-2`),
   using `--on-accent` for text/ink.
3. Replace `rgba(124,58,237,…)` purple relic shadows with accent-soft/token
   based shadows.
4. Retire `.led--sec` hardcoded `#7c3aed` to `--accent-2`.
5. Test, screenshot (8 + reduced-motion), verify contrast, self-critique.

## Test plan

- `npm test` → `SMOKE OK` (selectors + no CSP violation + no console error)
- 8 screenshots fa/en × dark/light × mobile/desktop + reduced-motion
- Node luminance check: `.ens`/`--link` ≥ 4.5:1 on both bg themes
- Visual: chips/buttons/pills read as one accent family, no stray purple

## Done criteria

- All listed components use tokens, no hardcoded off-palette purple/cyan
- `.ens` link passes AA on light and dark
- SMOKE OK, selectors intact, CSP unchanged
- plans/README 008 row → DONE

## STOP conditions

- If retokenizing drops a selector or breaks the smoke test → revert the
  offending rule, note it.
- If a contrast check still fails AA after the token change → adjust the token,
  do not ship failing contrast.
