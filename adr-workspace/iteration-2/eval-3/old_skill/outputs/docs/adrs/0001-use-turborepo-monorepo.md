---
title: "Use Turborepo Monorepo Structure"
adr: "0001"
status: Accepted
date: 2026-06-13
authors:
  - polikeiji
deciders:
  - polikeiji
changelog:
  - version: 1.0.0
    date: 2026-06-13
    author: polikeiji
    changes: Initial version
---

## Motivation

As the new platform grows, we need a clear repository strategy that supports multiple packages or services while keeping the development experience smooth. The choice of repository structure affects how engineers collaborate, how CI pipelines are designed, and how new team members ramp up. Without an intentional decision here, teams risk fragmented tooling, slow feedback loops, or unnecessarily complex dependency management.

## Decision Drivers

- **Developer experience** — Engineers should be able to make cross-package changes in a single workflow without juggling multiple repositories.
- **CI speed** — The build and test pipeline must remain fast as the codebase grows.
- **Onboarding ease** — New engineers should be able to get a working local environment with minimal friction.

## Options

### Option A: Polyrepo

Each service or package lives in its own repository.

| Driver | Pros | Cons |
|---|---|---|
| Developer experience | Clear separation of concerns; teams own their repo independently | Cross-package changes require multiple PRs, branch coordination, and version bumps |
| CI speed | Each repo has a small, focused pipeline | No shared caching across packages; duplicated CI config |
| Onboarding ease | Simple per-repo setup | New engineers must clone and configure many repos; harder to understand the full system |

### Option B: Monorepo with Turborepo

All packages live in a single repository managed by [Turborepo](https://turbo.build/repo) for task orchestration and caching.

| Driver | Pros | Cons |
|---|---|---|
| Developer experience | Cross-package refactors in a single PR; atomic commits across packages | Repo surface area is larger; discipline needed to avoid coupling |
| CI speed | Turborepo remote caching can skip unchanged packages | Cache configuration is more complex to set up and maintain correctly |
| Onboarding ease | Clone one repo, run one setup command | Larger initial clone size; monorepo tooling has a learning curve |

## Decision

We will use a **monorepo managed by Turborepo** (Option B).

Cross-package refactors are significantly easier when all code lives together — engineers can update a shared library and all consumers in a single PR without coordinating releases across repositories. New engineers only need to clone one repository to get a working environment, which materially lowers the onboarding bar.

Turborepo's task graph and remote caching address CI speed concerns at scale, and the complexity of configuring that caching is a one-time investment rather than an ongoing burden.

## Consequences

### Good

- Cross-package changes (refactors, shared library updates, API contract changes) are expressed as a single atomic commit and PR.
- New engineers clone one repo and have full visibility into the entire platform immediately.
- Turborepo's remote cache means unchanged packages are never rebuilt or retested, keeping CI fast as package count grows.
- Shared tooling (linting, formatting, testing configs) is defined once and reused across all packages.

### Bad

- CI caching configuration is more complex — cache keys, remote cache credentials, and task dependency graphs must be maintained carefully.
- The repository will grow large over time, increasing clone times and disk usage (mitigated by shallow clones and sparse checkout where needed).
- Monorepo discipline is required: without clear ownership boundaries, it is easy for packages to accumulate unintended dependencies.

## Links

- [Turborepo documentation](https://turbo.build/repo/docs)
- [Monorepo vs. Polyrepo — a practical comparison](https://monorepo.tools/)
