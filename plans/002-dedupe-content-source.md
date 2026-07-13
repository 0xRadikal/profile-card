# Plan 002: Blog/skills/timeline content has one source of truth

> **Executor instructions**: Follow step by step; run every verification and
> confirm before moving on. Honor STOP conditions. Update the 002 row in
> `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat aa2739e..HEAD -- index.js blog.html skills.html timeline.html en/blog.html en/skills.html en/timeline.html`
> On any change, compare the excerpts below to live code before proceeding.

## Status

- **Priority**: P2
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/001-cli-smoke-test.md
- **Category**: tech-debt
- **Planned at**: commit `aa2739e`, 2026-07-13

## Why this matters

The same blog/skills/timeline data is hand-copied into at least three places:
the JS arrays in `index.js`, the inline `<script>` in each standalone page
(`blog.html`, `skills.html`, `timeline.html`), and again in the English
mirrors under `en/`. Editing one post means editing it in ~6 files; they will
drift and already risk it. Consolidating to one data file removes the drift
class of bugs entirely and is a prerequisite mindset for plan 003 (no inline
scripts).

## Current state

- `index.js:171-199` — canonical-ish arrays `blogs`, `skillset`, `milestones`,
  `achievements` (each an array of small objects). Example:
  `blogs = [{title:'TON Validators & Playbooks', tag:'Infra', date:'2025-03-01'}, ...]`
- `blog.html`, `skills.html`, `timeline.html` — each ends with an inline
  `<script>` re-declaring the same arrays and rendering them (confirmed:
  `grep -c "TON Validators" index.js blog.html` → 1 and 1).
- `en/blog.html`, `en/skills.html`, `en/timeline.html` — English mirrors, same
  pattern.
- No bundler: files are static. A shared data file must be plain JS/JSON
  loadable from both the root and `en/` pages via an absolute
  `/profile-card/...` path (the repo convention — see `index.js:507` SW path
  and the absolute CSS/JS hrefs added in the earlier pass).

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Smoke test | `npm test` | `SMOKE OK`, exit 0 |
| Grep dup | `grep -rl "TON Validators" *.html en/*.html` | only pages that *render* it, none re-declaring the array |

## Scope

**In scope**:
- `data/content.js` (create) — single `export const blogs/skillset/milestones/achievements`
- `index.js` — import from the shared file instead of local arrays
- `blog.html`, `skills.html`, `timeline.html` and their `en/` mirrors — replace
  the inline data array with a small render script that imports the shared file

**Out of scope**:
- Copy/wording changes to any post — this is a pure move, byte-identical data.
- `profile-card.css`, `manifest.json`, `sw.js` structure (only add the new
  data file to the SW cache list if you touch caching — otherwise leave).

## Git workflow

- Branch: `advisor/002-dedupe-content`
- Commit per logical unit (create shared file; switch index.js; switch each
  page group). Conventional commits, e.g. `refactor(data): single source for blog/skills/timeline`.
- Do NOT push/PR unless instructed.

## Steps

### Step 1: Create `data/content.js`
Move the four arrays verbatim from `index.js:171-199` into
`data/content.js` as named `export const`s. Do not change any field values.

**Verify**: `node -e "import('./data/content.js').then(m=>console.log(m.blogs.length))"` → `3`

### Step 2: Consume in `index.js`
Replace the local array literals with `import { blogs, skillset, milestones, achievements } from '/profile-card/data/content.js'`. The `<script>` tag in
`index.html` that loads `index.js` must be `type="module"` for the import to
work — verify and update that tag if needed.

**Verify**: `npm test` → `SMOKE OK` (the CLI `blog`/`skills`/`timeline`
commands still render).

### Step 3: Switch the standalone pages
In each of `blog.html`, `skills.html`, `timeline.html` (+ `en/` mirrors),
delete the inline data array and instead import the same shared file in a
`type="module"` script, rendering identically.

**Verify**: `grep -rl "title:'TON Validators" *.html en/*.html` → **no matches**
(the array literal now lives only in `data/content.js`).

## Test plan

- Extend `test/smoke.mjs` (from plan 001) or add `test/pages.mjs` to load
  `blog.html` and assert the three post titles appear in the DOM, proving the
  shared import renders.
- Verification: `npm test` → all pass.

## Done criteria

- [ ] `npm test` exits 0
- [ ] `grep -rn "title:'TON Validators" .` returns exactly ONE match, in
      `data/content.js`
- [ ] Rendered pages (root + `en/`) still show the same posts (smoke assert)
- [ ] `plans/README.md` 002 row updated

## STOP conditions

- Making `index.js` a module breaks the theme init IIFE or SW registration
  timing (watch for `type="module"` deferring execution past `DOMContentLoaded`
  in a way that changes behavior) — if the smoke test regresses, stop.
- The `en/` pages diverge in wording from root (they are meant to be English
  translations, not identical) — if so, the data is NOT truly shared; report
  and propose a locale-keyed structure instead of forcing one array.
- Any absolute-path import 404s under the `/profile-card/` base — report.

## Maintenance notes

- After this lands, the ONLY place to edit a blog post is `data/content.js`.
- A reviewer should confirm no field values changed (diff the moved arrays).
- Deferred: a proper i18n layer (locale-keyed content) is out of scope; noted
  as a follow-up if fa/en text must live together.
