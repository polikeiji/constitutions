---
title: "Use Turborepo Monorepo for Platform Codebase"
adr: 1
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

As we build our new platform, we need to decide how to organize the codebase across multiple packages and services. Choosing the wrong repository structure early means significant migration cost later, so this decision must be made before development begins in earnest.

## Decision Drivers

- **Developer experience:** Cross-package changes should be easy — a refactor touching multiple packages should not require coordinating across separate repositories or managing dependency version bumps.
- **CI speed:** Build and test pipelines must remain fast as the codebase grows; caching and incremental builds matter.
- **Onboarding ease:** New engineers should be able to get up and running quickly without navigating multiple repositories, access policies, or divergent tooling setups.

## Options

### Option A: Polyrepo

Each package or service lives in its own repository with independent versioning and CI pipelines.

**Developer experience** (-) Cross-package changes require coordinated PRs across multiple repositories; dependency version bumps must be published and consumed manually, creating drift.  
**CI speed** (+) Each repo's pipeline is small and focused; no risk of one large monolithic CI job.  
**Onboarding ease** (-) New engineers must identify which repositories are relevant, clone several, configure each locally, and understand per-repo tooling differences.

### Option B: Turborepo Monorepo

All packages live in a single repository managed by Turborepo, which provides task orchestration, remote caching, and incremental builds.

**Developer experience** (+) Cross-package refactors happen in a single PR; package references are local, so no publish/consume cycle is needed during development.  
**CI speed** (+/-) Turborepo's task graph and remote caching keep CI fast, but the caching configuration is more complex to set up and maintain than a simple per-repo pipeline.  
**Onboarding ease** (+) One repository to clone, one set of tooling to configure; a single `npm install` at the root makes all packages available.

## Decision

We will use a **Turborepo monorepo** for the new platform.

Cross-package refactoring ease and simplified onboarding are the two strongest drivers. The polyrepo approach introduces coordination overhead that slows development velocity and makes onboarding unnecessarily complex. Turborepo's task graph and caching features directly address the CI speed concern, and the trade-off of higher caching complexity is acceptable — it is a one-time setup cost rather than an ongoing friction for every engineer.

## Consequences

- **Good:** Cross-package refactors are a single PR. New engineers clone one repo and are productive faster.
- **Good:** Turborepo remote caching means CI times stay manageable even as the number of packages grows.
- **Bad:** CI caching configuration is more involved — Turborepo pipelines and cache key strategies must be maintained as new packages and tasks are added.
- **Bad:** The single repository will grow large over time; git operations (clone, fetch) will slow down and may eventually require strategies such as sparse checkout or shallow clones.
- **Bad:** All packages share the same CI pipeline infrastructure; a misconfigured root-level change can affect all packages simultaneously.

## Links

- [Turborepo documentation](https://turbo.build/repo/docs)
