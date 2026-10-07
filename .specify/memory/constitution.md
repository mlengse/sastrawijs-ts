<!--
Sync Impact Report
------------------
Version change: (unratified scaffold) → 1.0.0
Bump rationale: Initial ratification of the project constitution (MINOR-equivalent
first release: establishes all principles and governance sections from an
unfilled template).

Modified principles:
- [PRINCIPLE_1_NAME] → I. Upstream Fidelity (new)
- [PRINCIPLE_2_NAME] → II. Library-First, Multi-Format Delivery (new)
- [PRINCIPLE_3_NAME] → III. Test-First (NON-NEGOTIABLE) (new)
- [PRINCIPLE_4_NAME] → IV. API & Semantic Stability (new)
- [PRINCIPLE_5_NAME] → V. Simplicity & YAGNI (new)

Added sections:
- Core Principles (5 principles)
- Additional Constraints
- Development Workflow & Quality Gates
- Governance

Removed sections: none (template scaffold fully replaced).

Follow-up TODOs: none — all placeholders resolved from repository context
(README.md, package.json, repository history).

Note: This HTML comment is scratch material for review and MUST be removed
before committing the amended constitution.
-->

# SastrawiJs (sastrawijs-ts) Constitution

## Core Principles

### I. Upstream Fidelity

- Stemming output MUST remain behaviorally consistent with the upstream
  [Sastrawi](https://github.com/sastrawi/sastrawi) PHP implementation
  (Nazief & Adriani, enhanced by Asian 2007 and Arifin et al. 2009 rules).
- Any deviation from upstream behavior MUST be justified by corpus evidence
  (e.g. the `evaluate` benchmark against KBBI) and documented alongside the
  change.
- Stemming rules, affix tables, and the root-word dictionary MUST NOT change
  without a regression test that demonstrates the intended new behavior.

**Rationale**: Users rely on this port as a drop-in equivalent of a known
algorithm; silent behavioral drift breaks downstream search and NLP pipelines.

### II. Library-First, Multi-Format Delivery

- The project is a library, not an application: ALL functionality MUST be
  reachable through the public programmatic API (`Stemmer`, `Tokenizer`) with
  no hidden global state or side effects at import time.
- Every release MUST ship all three module formats declared in
  `package.json` (`exports`, `module`, `browser`, `types`): ESM, CommonJS,
  and UMD, with `dist/index.d.ts` type declarations kept in sync.
- The export map MUST be verified mechanically (`npm run test:pkg` /
  `check-export-map`) before publish.

**Rationale**: Consumers span Node, bundlers, and plain `<script>` usage;
a format that exists in `package.json` but not on disk is a broken release.

### III. Test-First (NON-NEGOTIABLE)

- Tests MUST be written and fail before implementation for every behavioral
  change (Red-Green-Refactor).
- Every fixed stemmer bug MUST leave a permanent regression test behind.
- The full suite (`npm test`) MUST pass before any commit is considered
  complete; `prepublishOnly` MUST run `build`, `test`, and `test:pkg` in
  sequence.

**Rationale**: Stemming correctness is only observable through fixtures;
without enforced tests, refactors silently corrupt output.

### IV. API & Semantic Stability

- The public API surface (`Stemmer`, `Tokenizer`, constructor signatures,
  custom-dictionary support, package export paths) is covered by
  SemVer: backward-incompatible changes REQUIRE a MAJOR bump and a documented
  migration note.
- MINOR releases MAY add API surface or stemming rules that improve accuracy;
  PATCH releases are limited to bug fixes and non-semantic refinements.
- Upstream Sastrawi license terms MUST be honored: library code is MIT, the
  Kateglo-derived root dictionary remains CC-BY-NC-SA 3.0, and attribution
  MUST be preserved in distribution.

**Rationale**: The package is published to npm; downstream consumers pin
ranges, and licensing of the dictionary data is not ours to relicence.

### V. Simplicity & YAGNI

- The runtime package MUST have zero production dependencies.
- Start from the simplest implementation that preserves upstream algorithm
  structure; speculative abstractions, premature optimization, and features
  without a demonstrated use case are rejected.
- Deviation from the upstream Sastrawi source structure MUST be justified in
  the change description.

**Rationale**: A small deterministic text-processing core is trivially
auditable; dependency-free distribution also minimizes consumer supply-chain
risk.

## Additional Constraints

- Supported runtime: Node.js >= 20 (`engines` field is authoritative).
- Build tooling: Rollup with Babel and TypeScript; only `dist/` is published
  (`files` whitelist).
- Dictionary data provenance and license (Kateglo, CC-BY-NC-SA 3.0) MUST be
  documented in `README.md` and MUST NOT be stripped or re-licensed.
- No network access, environment mutation, or filesystem writes may occur at
  library import or stem time — stemming is a pure in-memory transformation.
- Documentation bilingual default: `README.md` (Indonesian) and
  `README.en.md` (English) MUST stay equivalent when either changes.

## Development Workflow & Quality Gates

- Pre-commit: husky + lint-staged runs ESLint (`--fix`) and Prettier on
  staged `js/ts/json/yml/yaml/md` files; commits MUST NOT bypass these hooks.
- Pre-merge: the `test` GitHub Actions workflow MUST be green on the PR.
- Pre-publish: `prepublishOnly` (`build` → `test` → `test:pkg`) is a hard
  gate; publishing with a failing gate is prohibited.
- Accuracy gate: run `npm run evaluate` (benchmark vs. KBBI corpus) when
  touching stemming rules or the dictionary; accuracy regressions MUST be
  reported in the PR description.
- Reviews MUST check constitution compliance: upstream fidelity, test
  coverage for behavior changes, API stability, and dependency additions.

## Governance

- This constitution supersedes ad-hoc conventions for this repository.
- Amendments are made by editing `.specify/memory/constitution.md`, bumping
  the version per SemVer (MAJOR: principle removal/redefinition;
  MINOR: new principle or materially expanded guidance; PATCH: clarification
  or wording), updating `Last Amended`, and including a Sync Impact Report
  as an HTML comment for review.
- The Sync Impact Report MUST be removed before the amendment is committed.
- Every PR review MUST verify compliance with the Core Principles; if a
  change cannot comply, the constitution MUST be amended first (or the
  change rejected).
- Complexity, new dependencies, and API breaks MUST be explicitly justified
  in the PR description against the relevant principle.
- Runtime development guidance beyond governance lives in `README.md` and
  `README.en.md`.

**Version**: 1.0.0 | **Ratified**: 2026-10-07 | **Last Amended**: 2026-10-07
