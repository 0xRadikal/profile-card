# Plan 003: The site ships a real Content-Security-Policy with no inline scripts

> **Executor instructions**: Follow step by step; run every verification.
> Honor STOP conditions. Update the 003 row in `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat aa2739e..HEAD -- *.html en/*.html`
> On any change, re-list inline scripts before proceeding.

## Status

- **Priority**: P2
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/001-cli-smoke-test.md (regression net); best done
  after plans/002 (which removes most inline scripts)
- **Category**: security
- **Planned at**: commit `aa2739e`, 2026-07-13

## Why this matters

There is currently **no CSP** (`grep -rn "Content-Security-Policy" *.html en/*.html`
→ nothing). The earlier pass hardened the two DOM-injection vectors in JS, but
a page-level CSP is the belt-and-suspenders control that neutralizes an entire
XSS class regardless of a future coding slip. It cannot be added while inline
`<script>` blocks exist in the standalone pages, so this plan removes those
first (or relies on plan 002 having done so), then adds the header.

## Current state

- Inline `<script>` blocks exist in: `blog.html contact.html gallery.html
  projects.html skills.html timeline.html` and all six `en/` mirrors
  (12 files total — confirmed by `grep -rln "<script>" *.html en/*.html`).
- External script/style origins in use: self (`/profile-card/*`), the Google
  Fonts / CDN references in `<head>` (check each file's `<head>`), and
  `api.github.com` is reached via `fetch` from `index.js` (connect-src).
- GitHub Pages is a static host — a real response header is not settable, so
  CSP must ship as `<meta http-equiv="Content-Security-Policy">` in each page's
  `<head>`. (Note: `<meta>` CSP cannot use `frame-ancestors` or `report-uri`;
  that limitation is expected and acceptable here.)

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Smoke test | `npm test` | `SMOKE OK`, exit 0 |
| Find inline scripts | `grep -rln "<script>" *.html en/*.html` | empty (after step 1) |
| Confirm CSP present | `grep -rl "Content-Security-Policy" *.html en/*.html` | every page listed |

## Scope

**In scope**:
- All `*.html` and `en/*.html` — move each inline `<script>` into an external
  `.js` file loaded with `<script src=... type="module">`, then add the CSP
  `<meta>` to every `<head>`.
- New external JS files under e.g. `pages/` for the extracted scripts.

**Out of scope**:
- `index.js` behavior, CSS. Do not tighten CSP so far it blocks the existing
  CDN font/style origins the pages legitimately use — enumerate and allow them.

## Git workflow

- Branch: `advisor/003-csp`
- Commit 1: extract inline scripts to external files. Commit 2: add CSP meta.
  Conventional commits, e.g. `security(csp): remove inline scripts` /
  `security(csp): add strict Content-Security-Policy`.
- Do NOT push/PR unless instructed.

## Steps

### Step 1: Extract every inline `<script>` to an external module
For each of the 12 pages, cut the inline script body into a sibling file
(e.g. `pages/blog.js`) and reference it with
`<script src="/profile-card/pages/blog.js" type="module"></script>`.
(If plan 002 already replaced these with shared-import modules, this step is
mostly done — just confirm none remain inline.)

**Verify**: `grep -rln "<script>" *.html en/*.html` → **no output**

### Step 2: Add the CSP `<meta>` to every `<head>`
Add a policy that allows exactly what the site needs. Start from:
```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' <cdn-font-origins-you-found>;
img-src 'self' https://github.com data:;
connect-src 'self' https://api.github.com;
font-src 'self' <cdn-font-origins>;
base-uri 'self'; object-src 'none'
```
Replace `<cdn-font-origins>` with the actual origins found in the `<head>`s.
Keep `style-src 'unsafe-inline'` ONLY if inline `style=` attributes/`<style>`
are present (the CSS is external, but check the HTML) — prefer dropping it if
nothing needs it.

**Verify**: `npm test` → `SMOKE OK` AND load each page in the smoke test
asserting **0 CSP violation console errors** (Playwright surfaces them as
console errors).

## Test plan

- Extend the smoke test to load every page and assert no console message
  matching `Content Security Policy` / `Refused to`.
- Verification: `npm test` → all pass, zero CSP violations logged.

## Done criteria

- [ ] `grep -rln "<script>" *.html en/*.html` returns nothing
- [ ] Every page's `<head>` contains a `Content-Security-Policy` meta
- [ ] `npm test` exits 0 with zero CSP-violation console errors
- [ ] `plans/README.md` 003 row updated

## STOP conditions

- The CSP breaks a legitimate feature (fonts not loading, GitHub fetch blocked,
  particles/canvas failing) and the fix would require `'unsafe-inline'` for
  `script-src` — that defeats the purpose; stop and report the offending
  origin so the policy can be widened deliberately, not blanket-loosened.
- A page uses an inline event handler (`onclick=...`) that CSP will block and
  that plan 002 did not remove — report; do not silently add `'unsafe-inline'`.

## Maintenance notes

- Any new external origin (analytics, new CDN) must be added to the matching
  `*-src` directive or it will be blocked at runtime.
- Reviewer should paste each final policy into a CSP evaluator and confirm no
  `'unsafe-eval'` and no wildcard `*` slipped in.
