# Plan 001: A headless smoke test proves the CLI runtime contract holds

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If
> anything in "STOP conditions" occurs, stop and report. When done, update the
> status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat aa2739e..HEAD -- index.js index.html`
> If either file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch, treat
> it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `aa2739e`, 2026-07-13

## Why this matters

The repo has zero automated tests (no `package.json`, no CI). Every fix so far
has been verified by hand in a browser. `index.js` queries 15 specific DOM
ids/selectors at module load; if any HTML edit renames or drops one (e.g.
`#starsLive`, `#input`), the CLI silently half-breaks with no error. A tiny
headless smoke test turns that silent breakage into a red check, and becomes
the safety net that lets plans 002 and 003 refactor with confidence.

## Current state

- `index.js:11-24,27` — reads these on load; each MUST exist in `index.html`:
  `#output #input #helpBtn #clearBtn #muteBtn #suggestions #toast .card
  #starsLive #commitLive #snippetCode #copySnippet #particles #themeToggle`
  and `#contact form.card-form`, `#themeToggle`.
- `index.html` currently contains all of them (verified: each id appears
  exactly once; a `<form class="card-form">` sits inside `#contact` at
  `index.html:359`).
- `index.js:302-312 scrollToSection` calls `getElementById(id)` — the sections
  `blog contact gallery projects skills timeline` all exist as `id=...` in
  `index.html`.
- No build tooling exists. The site is served as static files under the
  `/profile-card/` base path.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Init npm | `npm init -y` | creates `package.json`, exit 0 |
| Add dep | `npm i -D playwright` | exit 0 |
| Install browser | `npx playwright install chromium` | exit 0 |
| Run test | `node test/smoke.mjs` | prints `SMOKE OK`, exit 0 |

## Scope

**In scope** (create only):
- `package.json` (from `npm init -y`, then add the `test` script)
- `test/smoke.mjs`
- `.gitignore` (add `node_modules/` if not already ignored)

**Out of scope** (do NOT touch):
- `index.js`, `index.html`, `profile-card.css` — this plan only *observes*
  them; it must not change behavior.

## Git workflow

- Branch: `advisor/001-cli-smoke-test`
- One commit; message style = conventional commits (repo uses them, e.g.
  `git log` shows `fix(assets): ...`). Use `test: add headless CLI smoke test`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Scaffold npm + Playwright
Run `npm init -y`, `npm i -D playwright`, `npx playwright install chromium`.
Add to `package.json` scripts: `"test": "node test/smoke.mjs"`.
Ensure `.gitignore` contains `node_modules/`.

**Verify**: `test -d node_modules/playwright && echo dep-ok` → `dep-ok`

### Step 2: Write `test/smoke.mjs`
The test must: (a) start a static server rooted so the site is reachable at
`/profile-card/index.html` (serve the repo parent, or copy into a temp
`profile-card/` dir), (b) load the page with Playwright, (c) assert **zero
console errors**, (d) assert every contract id/selector below resolves, (e)
type `help` into `#input` + press Enter and assert `#output` gains a child.

Contract selectors to assert present (fail the test if any is missing):
```
#output #input #helpBtn #clearBtn #muteBtn #suggestions #toast .card
#starsLive #commitLive #snippetCode #copySnippet #particles #themeToggle
#contact form.card-form
```
On all assertions passing, print exactly `SMOKE OK` and exit 0; on any
failure print the failing selector/error and exit 1.

**Verify**: `node test/smoke.mjs` → stdout contains `SMOKE OK`, exit 0

## Test plan

- New file `test/smoke.mjs` covering: page loads with 0 console errors;
  all 15 contract selectors resolve; running `help` appends output.
- No existing test to model after (this is the first).
- Verification: `npm test` → `SMOKE OK`, exit 0.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `npm test` exits 0 and prints `SMOKE OK`
- [ ] `git status` shows only `package.json`, `package-lock.json`,
      `test/smoke.mjs`, `.gitignore` added — no change to `index.js` /
      `index.html` / `profile-card.css`
- [ ] `plans/README.md` status row for 001 updated

## STOP conditions

Stop and report (do not improvise) if:

- The drift check shows `index.html` or `index.js` changed since `aa2739e`
  and a contract id no longer matches the list above.
- Playwright's browser download fails in this environment (report; do not
  switch to an unrelated headless approach without approval).
- The smoke test fails on the current committed code — that means a contract
  id is ALREADY missing; report which one rather than editing HTML to satisfy
  the test.

## Maintenance notes

- When plans 002/003 land, re-run `npm test` — it is the regression gate.
- A reviewer should confirm the test asserts *console errors === 0*, not just
  "page loaded", since the historic failure mode was silent JS breakage.
