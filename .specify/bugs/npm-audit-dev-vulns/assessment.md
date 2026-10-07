# Bug Assessment: npm audit reports 34 vulnerabilities (all devDependencies)

- **Slug**: npm-audit-dev-vulns
- **Created**: 2026-10-07
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

> `npm audit melaporkan 34 vulnerability (2 moderate, 31 high, 1 critical), semuanya di devDependencies.`

No URL supplied. Reproduced verbatim on this checkout (no `node_modules` present, audit run against `package-lock.json`):

```
34 vulnerabilities (2 moderate, 31 high, 1 critical)
```

Severity breakdown from `npm audit --json` metadata:

```
info 0 | low 0 | moderate 2 | high 31 | critical 1 | total 34
dependencies: prod 1, dev 797, optional 26, peer 0
```

Top-level findings:

| Package                   | Severity     | Direct?                | Range in lock                    | Fix                                 |
| ------------------------- | ------------ | ---------------------- | -------------------------------- | ----------------------------------- |
| `shell-quote`             | **critical** | no (via `npm-run-all`) | 1.10.0 (vulnerable 1.8.4–1.10.0) | `npm audit fix` → 1.12.0            |
| `jest` / `babel-jest`     | high         | **yes**                | 29.7.0                           | `jest@30.5.2` (semver-major)        |
| `lint-staged`             | high         | **yes**                | 15.5.2                           | `lint-staged@17.6.0` (semver-major) |
| `micromatch` → `braces`   | high         | no                     | 4.0.8 → 3.0.3                    | only via the two majors above       |
| `brace-expansion`         | high         | no                     | 1.1.16 / 5.0.8                   | `npm audit fix` (in-range)          |
| `js-yaml`                 | high         | no                     | 3.15.0 / 4.3.0                   | `npm audit fix` → 3.15.2 / 4.3.2    |
| `sprintf-js` → `argparse` | moderate     | no                     | 1.0.3 / 1.0.10                   | **no fixed release exists**         |

Advisories driving the count:

- GHSA-pqg4-j6r4-53mv — `shell-quote` `quote()` command injection (CVSS 8.1) — **critical**
- GHSA-vfj7-8cjw-p6xm — `braces` stack-exhaustion DoS, affected `<=3.0.3` (all releases) — high
- GHSA-mh99-v99m-4gvg, GHSA-rgw5-rvv9-x895, GHSA-qhr7-859c-m2p7, GHSA-6j4f-fj2g-mc7p, GHSA-q2hr-2g5m-vwhr — `brace-expansion` DoS cluster — high
- GHSA-5p4m-2wfm-xmqj, GHSA-2883-xcg3-v3hh — `js-yaml` quadratic CPU / merge-key DoS — high
- GHSA-hp3w-g68c-fv3c — `sprintf-js` unbounded precision DoS, affected `<=1.1.3` (all releases) — moderate
- ~24 `high` entries are **transitive rollups**: `jest 29` → `jest-message-util` → `micromatch` → `braces`, and `lint-staged 15` → `micromatch` → `braces`. npm counts every package in the chain as a separate finding.

## Symptom

`npm audit` reports 34 vulnerabilities (1 critical, 31 high, 2 moderate) in this repository; expected result is a clean audit. All affected packages live under `devDependencies`, so nothing is published to consumers — the package publishes only `dist/`.

## Reproduction

1. Clone `sastrawijs-ts` at `4dfffdc` (no `node_modules`).
2. Run `npm audit`.
3. Observe `34 vulnerabilities (2 moderate, 31 high, 1 critical)`.

Verified observations from read-only probes (all run in `%TEMP%` clones, workspace unmodified):

- **Fresh `npm install` already refreshes 5 stale lock entries**: `shell-quote 1.10.0→1.12.0`, `js-yaml 3.15.0→3.15.2` and `4.3.0→4.3.2`, `brace-expansion 1.1.16→1.1.21` and `5.0.8→5.0.12`. Audit then reads `34 (5 moderate, 29 high, 0 critical)` — **the critical disappears**, two highs resolve, three moderates surface (`@istanbuljs/load-nyc-config`, `babel-plugin-istanbul`).
- **`npm audit fix` (non-force) after install changes nothing**: still `34 (5 moderate, 29 high, 0 critical)`.
- **`npm audit fix --force`** sets `jest@^30.5.2`, `babel-jest@^30.5.2`, `lint-staged@^17.6.0`. Result: `19 moderate, 0 high, 0 critical`. **Test suite passes on jest 30: 3 suites / 76 tests, 0 failures.**
- The residual 19 moderate are one root cause: `sprintf-js <=1.1.3` (every published version affected) ← `argparse@1.0.10` ← `js-yaml@3.15.2` ← `@istanbuljs/load-nyc-config@1.1.0` ← `babel-plugin-istanbul@6.1.1` ← `babel-jest`/`@jest/transform`.

## Suspected Code Paths

- `package.json:58` — `babel-jest: ^29.7.0` (direct, high)
- `package.json:65` — `jest: ^29.7.0` (direct, high; accounts for ~27 of the 34 findings through `micromatch`/`braces`)
- `package.json:66` — `lint-staged: ^15.2.11` (direct, high via `micromatch@4.0.8` → `braces@3.0.3`)
- `package.json:67` — `npm-run-all: ^4.1.5` (pulls `shell-quote@1.10.0`, the critical)
- `package.json:60` — `eslint-plugin-jest: ^28.14.0` → `babel-plugin-istanbul` → `@istanbuljs/load-nyc-config` → `js-yaml@3` (moderate chain)
- `package-lock.json` — `node_modules/shell-quote` pinned at `1.10.0`; lock is stale relative to what a fresh `npm install` resolves
- `package.json:92-95` — `lint-staged` config consumed by `.husky` hooks (why the `lint-staged` major matters operationally)
- `package.json:61` — `@types/jest: ^30.0.0` already targets jest 30 (no types bump needed)

Note: CodeGraph indexes source symbols, not npm manifests, so the evidence above comes from `package.json` / `package-lock.json` reads and `npm audit` output.

## Root Cause Hypothesis

The dependency manifest pins two stale direct devDependencies — `jest`/`babel-jest` at `^29.7.0` and `lint-staged` at `^15.2.11` — whose transitive `micromatch@4` → `braces@3.0.3` chain matches every open braces/micromatch advisory, and npm scores each package in the chain as its own finding, inflating 2 real roots into ~31 highs. A third root, `npm-run-all → shell-quote@1.10.0`, is critical but is fixed by any semver-compatible refresh; the committed `package-lock.json` is simply stale (a fresh install already bumps it to the patched 1.12.0). The remaining moderates have no upstream fix, because both `braces (<=3.0.3)` and `sprintf-js (<=1.1.3)` advisories cover every published version. **Confidence: high** (verified empirically in isolated temp clones, including a green test run on jest 30).

## Proposed Remediation

**Preferred**: two-step upgrade, then accept the residue.

1. Refresh the lockfile (`npm install` or `npm audit fix`, non-breaking) — clears the critical `shell-quote` and the `js-yaml`/`brace-expansion` highs with zero API risk.
2. Bump the two direct majors: `jest`/`babel-jest` → `^30.5.2` and `lint-staged` → `^17.6.0` (equivalently `npm audit fix --force`, or hand-edit `package.json` and re-install to avoid npm rewriting unrelated entries). Verified in a temp clone: **0 critical, 0 high, 19 moderate, 76/76 tests pass.** `@types/jest@^30.0.0` and `eslint-plugin-jest@^28` are already compatible.
3. Document the residual 19 moderate (`sprintf-js` via `js-yaml@3`) as accepted risk in the assessment/README, since no fixed `sprintf-js` exists. Re-check periodically.

**Alternatives**:

- `overrides` in `package.json` (e.g. `"brace-expansion": "^1.1.21"`, `"js-yaml": "^4.3.2"`) — keeps jest 29 but forces versions the parent ranges don't declare; `js-yaml 4` drops `safeLoad`, which would break `@istanbuljs/load-nyc-config` at runtime. Higher breakage risk than the majors, and does not help `sprintf-js` (all versions vulnerable).
- Do nothing / `npm audit --omit=dev` in CI — defensible since prod exposure is zero, but leaves a known-critical `shell-quote` in the pre-commit/publish toolchain.

**Files likely to change**:

- `package.json` (`jest`, `babel-jest`, `lint-staged` ranges)
- `package-lock.json` (refresh)

**Tests to add or update**:

- No new unit tests required — the existing 76 tests across 3 suites are the regression gate for the jest 29→30 move and already pass.
- Add a CI step (`npm audit --audit-level=high`) so critical/high regressions fail the build while the moderate residue is tolerated.

## Risks & Considerations

- `lint-staged 15 → 17` drops `micromatch` for `picomatch`; the config at `package.json:92-95` uses plain globs (`*.{js,ts}`) so it should behave identically, but the pre-commit hook must be smoke-tested (`.husky/`).
- `jest 29 → 30` is a major: config here is minimal (`rootDir`, `transform`, `testMatch` in `package.json:80-88`) and passes unchanged; snapshot/config edge cases are not in play (0 snapshots).
- Residual moderate DoS advisories are local-tooling only (attacker-controlled YAML/precision strings reaching js-yaml/sprintf-js) — not reachable from published `dist/`.
- All findings are devDependency-only; published artifact and `dependencies` are unaffected (`prod: 1` = root package itself).
- `npm audit fix --force` may rewrite unrelated lockfile entries; prefer explicit `package.json` edits plus a clean install for a reviewable diff.
- No CI currently enforces audit status (`.github/` present; verify workflow coverage during fix).

## Open Questions

- [NEEDS CLARIFICATION: Should the residual 19 moderate (`sprintf-js`, no upstream fix) be enforced at a specific audit level in CI, e.g. `--audit-level=high`?]
- [NEEDS CLARIFICATION: Is `npm-run-all` still needed, or can `run-s`/`run-p` be replaced by native `npm run a && npm run b`, removing `shell-quote` entirely?]
