# Plan 004: README no longer claims something the code contradicts

> **Executor instructions**: Follow step by step; run the verification. Honor
> STOP conditions. Update the 004 row in `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat aa2739e..HEAD -- README.md`
> On any change, re-locate the claim before editing.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `aa2739e`, 2026-07-13

## Why this matters

Documentation that states a security/architecture property the code does not
have is worse than silence: a future contributor trusts it and skips the CSP
work, or a reviewer waves through an inline script "because the README says we
don't allow them." The repo's standalone pages DO contain inline `<script>`
blocks today, so any README statement implying "no inline scripts" / a strict
CSP is false and must be corrected (or scoped to a TODO).

## Current state

- `grep -rln "<script>" *.html en/*.html` lists 12 pages with inline scripts.
- No CSP exists yet (`grep -rn "Content-Security-Policy" *.html en/*.html` is
  empty).
- `README.md` (17KB) should be scanned for any claim about inline scripts,
  CSP, or "no third-party JS" that the above contradicts. **First locate the
  exact line(s)** — do not assume wording:
  `grep -niE "inline|content.security|csp|no .*script" README.md`

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Locate claim | `grep -niE "inline|csp|content.security" README.md` | shows the line(s) to fix |
| Confirm reality | `grep -rln "<script>" *.html en/*.html` | the pages that still have inline scripts |

## Scope

**In scope**:
- `README.md` only.

**Out of scope**:
- Any HTML/JS/CSS. This plan does NOT fix the inline scripts (that is plan
  003); it only makes the docs truthful about the *current* state.

## Git workflow

- Branch: `advisor/004-readme-fix`
- One commit. Conventional commits: `docs(readme): correct inline-script/CSP claim`.
- Do NOT push/PR unless instructed.

## Steps

### Step 1: Locate and correct the claim
Run the `grep` above. For each matching claim, either (a) delete it, or (b)
rewrite it to describe reality plus intent, e.g.:
"Standalone section pages currently use small inline `<script>` blocks; a
strict Content-Security-Policy and script externalization are planned (see
`plans/003-content-security-policy.md`)."
Pick the phrasing that matches the README's existing tone.

**Verify**: `grep -niE "no inline|strict csp|content.security" README.md`
returns either nothing or only the corrected/qualified wording — no sentence
that flatly asserts a property the code lacks.

## Test plan

- No automated test (docs only). Manual verification via the grep above.

## Done criteria

- [ ] No README sentence claims a CSP or "no inline scripts" that the current
      code contradicts
- [ ] If the claim was reframed as intent, it points at `plans/003-*.md`
- [ ] `git status` shows only `README.md` changed
- [ ] `plans/README.md` 004 row updated

## STOP conditions

- The grep finds NO such claim at all — then this plan is unnecessary; mark
  004 as REJECTED in `plans/README.md` with reason "no contradicting claim
  found" and stop.
- The claim is entangled with a larger accurate paragraph — quote it in your
  report and ask before deleting surrounding true content.

## Maintenance notes

- When plan 003 lands and a real CSP exists, revisit this section and promote
  the "planned" wording to a factual "the site ships a CSP" statement.
