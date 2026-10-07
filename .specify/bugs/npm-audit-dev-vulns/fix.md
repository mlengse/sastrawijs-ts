# Bug Fix: Clear npm audit critical/high findings in devDependencies

- **Slug**: npm-audit-dev-vulns
- **Fixed**: 2026-10-07
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Upgraded the two stale direct devDependencies that caused every critical/high finding — `jest`/`babel-jest` 29 → 30.5.2 and `lint-staged` 15 → 16.4.0 — then ran a non-breaking `npm audit fix` to refresh in-range transitive pins (`shell-quote`, `js-yaml`, `brace-expansion`), and added a CI gate so high/critical regressions fail the build. Audit went from **34 (1 critical, 31 high, 2 moderate)** to **19 moderate, 0 high, 0 critical**.

## Changes

| File                          | Change   | Notes                                                                                                                                                                                                                 |
| ----------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                | modified | `jest` `^29.7.0 → ^30.5.2`, `babel-jest` `^29.7.0 → ^30.5.2`, `lint-staged` `^15.2.11 → ^16.4.0`; no other fields touched                                                                                             |
| `package-lock.json`           | modified | Re-resolved tree: `shell-quote 1.10.0 → 1.12.0` (critical), `js-yaml 3.15.0 → 3.15.2` and `4.3.0 → 4.3.2`, `brace-expansion 1.1.16 → 1.1.21` / `5.0.8 → 5.0.12`, `micromatch`/`braces` removed from the tree entirely |
| `.github/workflows/test.yaml` | modified | New `Audit dependencies` step running `npm audit --audit-level=high` before install/test                                                                                                                              |

## Diff Highlights

```diff
 package.json
-    "babel-jest": "^29.7.0",
+    "babel-jest": "^30.5.2",
-    "jest": "^29.7.0",
-    "lint-staged": "^15.2.11",
+    "jest": "^30.5.2",
+    "lint-staged": "^16.4.0",
```

```diff
 .github/workflows/test.yaml
+      - name: Audit dependencies
+        run: npm audit --audit-level=high
+
       - name: Install and test
```

## Tests Added or Updated

- None added. Per the assessment, the existing 76 tests across 3 suites are the regression gate for the jest 29 → 30 move; they pass unchanged.
- New guard: `npm audit --audit-level=high` in `.github/workflows/test.yaml` — fails CI on any future critical/high advisory while tolerating the moderate residue.

## Local Verification

- `npm install` + `npm audit fix` → lock refreshed; `node_modules/micromatch` and `node_modules/braces` absent from the tree.
- `npm audit` → **`{"moderate": 19, "high": 0, "critical": 0, "total": 19}`** (was `2 moderate, 31 high, 1 critical`).
- `npm test` → **Test Suites: 3 passed, Tests: 76 passed, 0 failed** (jest 30.5.2).
- `npm run build` → rollup produced `dist/sastrawijs-ts.{umd,cjs,esm}` in 5.8s.
- `npm run test:pkg` → `check-export-map` **PASS**.
- `npx eslint src` → exit 0, no problems.
- lint-staged 16.4.0 smoke test: isolated throwaway git repo (junction to this `node_modules`), staged `sample.ts`, ran `lint-staged` → `eslint --fix` and `prettier --write` both `COMPLETED`, exit 0. The workspace git index was never touched.
- `git diff package.json` → exactly the three version bumps, nothing else.

## Deviations from Assessment

1. **`lint-staged ^16.4.0` instead of the assessed `^17.6.0`.**
   Discovered during implementation: `lint-staged@17.6.0` declares `engines.node >=22.22.1`, which silently drops this repo's declared Node 20 floor (`.nvmrc = 20`, `engines: ">=20"`, CI matrix `20.x`). `lint-staged@16.4.0` (engines `>=20.17`) already swaps `micromatch` for `picomatch`, sits outside the advisory range `7.0.0 – 16.3.4`, and was verified to produce the **identical** audit outcome (0 critical / 0 high / 19 moderate) with 76/76 tests passing. User chose this option (A) explicitly. Jev was called on the choice and returned an inconclusive `no` (p=0.43, confidence 0.13), so the human decision governs.

2. **CI audit step added.** Listed by the assessment under _Tests to add or update_, but `.github/workflows/test.yaml` was not in _Files likely to change_ — scope expansion logged here as required.

3. **Observed, not caused by this fix:** a fresh `npm install` alone does **not** refresh `shell-quote`/`js-yaml`/`brace-expansion`; the non-breaking `npm audit fix` is what applies those in-range bumps. The assessment described the refresh as install-time; the mechanism is `npm audit fix`.

## Follow-ups

- **Residual 19 moderate** all trace to one root: `sprintf-js <=1.1.3` (every published version affected) ← `argparse@1.0.10` ← `js-yaml@3.15.2` ← `@istanbuljs/load-nyc-config` ← `babel-plugin-istanbul` ← `babel-jest`. No upstream fix exists — re-check periodically; do not attempt a `js-yaml@4` override (drops `safeLoad`, would break the config loader).
- **Pre-existing, unrelated:** `npx eslint .` fails on `babel.config.js:1` with `'module' is not defined (no-undef)` because the flat config has no Node globals for root JS files (`scripts/**` is ignored, `babel.config.js` is not). Lint only bites when `babel.config.js` itself is staged. Suggest adding a `languageOptions.globals` block for root `*.js` or extending `ignores`.
- Open question from the assessment stands: whether any other audit level (e.g. `--omit=dev`) should also be enforced; prod dependencies remain at zero vulnerabilities.
- `npm ci` currently emits `install-scripts` warnings for `@parcel/watcher` and `unrs-resolver` (blocked by npm's `allowScripts` gate) — unrelated to this fix, but worth approving or documenting if native watchers are needed.
