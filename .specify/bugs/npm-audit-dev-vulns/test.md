# Bug Verification: npm audit devDependency vulnerabilities

- **Slug**: npm-audit-dev-vulns
- **Tested**: 2026-10-07
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The original symptom no longer reproduces: `npm audit` went from 34 findings (1 critical, 31 high, 2 moderate) to 19 moderate with **0 critical and 0 high**, and the new CI gate `npm audit --audit-level=high` exits 0. The full regression path (`npm ci` → build → 76 tests → export-map check) passes on the upgraded jest 30.5.2 / lint-staged 16.4.0 tree; the only failing check, `npx eslint .`, is a pre-existing config error unrelated to the fix.

## Checks Performed

| Check                              | Command / Action                                                                          | Result              | Notes                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------- |
| Reproduction (post-fix)            | `npm audit`                                                                               | pass                | Symptom (34 / 1 critical / 31 high) gone → `19 moderate, 0 high, 0 critical`          |
| CI audit gate                      | `npm audit --audit-level=high`                                                            | pass                | exit **0** — gate tolerates the moderate residue, would fail on any high/critical     |
| Lock/package sync (CI parity)      | `npm ci --no-fund`                                                                        | pass                | exit 0 — lockfile consistent with `package.json`, mirrors CI install step             |
| New / updated tests                | _none added_ (per assessment)                                                             | n/a                 | Guard added instead: the CI audit step above                                          |
| Regression suite                   | `npm test`                                                                                | pass                | 3 suites / **76 tests passed**, jest 30.5.2, exit 0                                   |
| Build                              | `npm run build`                                                                           | pass                | rollup → `dist/*.{umd,cjs,esm}` in 8.2s, exit 0                                       |
| Export-map check                   | `npm run test:pkg`                                                                        | pass                | `check-export-map` → `PASS package.json`, exit 0                                      |
| Lint (project source)              | `npx eslint src`                                                                          | pass                | exit 0, no problems                                                                   |
| Lint (whole repo)                  | `npx eslint .`                                                                            | fail (pre-existing) | 1 error: `babel.config.js:1 'module' is not defined (no-undef)` — see below           |
| Pre-commit hook smoke              | `lint-staged` in throwaway git repo (junction to this `node_modules`), staged `sample.ts` | pass                | `eslint --fix` + `prettier --write` COMPLETED, exit 0; workspace index untouched      |
| CI Node matrix (20.x / 22.x)       | —                                                                                         | not-run             | Local runtime is Node 24.16.0; matrix only exercises on GitHub Actions                |
| Old-tree `npx eslint .` comparison | —                                                                                         | not-run             | Baseline had no `node_modules`; pre-existence proven structurally instead (see below) |

## Output Excerpts

```
== npm audit (post-fix) ==
{"info":0,"low":0,"moderate":19,"high":0,"critical":0,"total":19}

== npm audit --audit-level=high ==
gate-exit=0

== npm ci ==
ci-exit=0

== npm test ==
Test Suites: 3 passed, 3 total
Tests:       76 passed, 76 total
test-exit=0

== npm run test:pkg ==
Checking export maps...
 PASS  package.json

== npx eslint . ==
C:\Users\anjan\dev\sastrawijs-ts\babel.config.js
  1:1  error  'module' is not defined  no-undef
✖ 1 problem (1 error, 0 warnings)
eslint-dot-exit=1
```

**Pre-existence proof for the `eslint .` failure** — old lock (`HEAD`) vs new lock, resolved versions identical for the whole lint stack:

```
eslint 9.39.5 -> 9.39.5      @eslint/js 9.39.5 -> 9.39.5
@eslint/eslintrc 3.3.6 -> 3.3.6   typescript-eslint 8.65.0 -> 8.65.0
jest 29.7.0 -> 30.5.2        lint-staged 15.5.2 -> 16.4.0     babel-jest 29.7.0 -> 30.5.2
```

`eslint.config.mjs` and `babel.config.js` are both untouched by the fix (`git status` shows only `package.json`, `package-lock.json`, `.github/workflows/test.yaml` modified), so the `no-undef` error cannot be attributed to this change.

## Residual Risks

- **19 moderate findings remain** (single root: `sprintf-js <=1.1.3` via `js-yaml 3 ← @istanbuljs/load-nyc-config ← babel-plugin-istanbul`); no upstream fix exists. Accepted risk per assessment; the CI gate deliberately ignores them (`--audit-level=high`).
- **Node 20.x / 22.x CI matrix not exercised locally** (Node 24.16.0 used). Jest 30 declares `^18.14 || ^20 || ^22 || >=24` and lint-staged 16.4.0 declares `>=20.17`, so both are expected to pass, but only Actions will confirm. Note `.nvmrc` says bare `20` → resolves to latest 20.x (≥20.17 required by lint-staged).
- **`npx eslint .` fails** on `babel.config.js` (pre-existing). It only surfaces when that file itself is staged for commit; `eslint src` is clean.
- `npm ci` warns that install scripts for `@parcel/watcher` and `unrs-resolver` are blocked by npm's `allowScripts` gate — unrelated to this fix, but native tooling may be degraded.
- Verified against the public npm registry advisory data as of 2026-10-07; counts drift as new advisories publish.

## Recommendation

**Close the bug — verified end-to-end.** The reproduction from the assessment was re-run after the fix and the critical/high findings are gone, the new CI gate passes, and the full build/test/export chain is green on the upgraded dependency tree. Remaining items are the accepted moderate residue (no upstream fix), a pre-existing `eslint .` config error worth a separate ticket, and first confirmation of the Node 20/22 matrix on the next GitHub Actions run.
