# ADR 0001: Use Turborepo Monorepo Structure

**Status:** Accepted
**Date:** 2026-06-13

## Context

We needed to decide on a repository structure for our new platform. The two main options we considered were:

1. **Polyrepo** — each package/service lives in its own repository
2. **Monorepo using Turborepo** — all packages/services live in a single repository managed with Turborepo

The key evaluation criteria were:

- **Developer experience** — specifically, how easy it is to make cross-package changes
- **CI speed** — how fast the continuous integration pipeline runs
- **Onboarding** — how easy it is for new engineers to get up and running

## Decision

We will use a **Turborepo monorepo** structure for the new platform.

## Options Considered

### Option 1: Polyrepo

Each package or service has its own dedicated repository.

**Pros:**
- Smaller, focused repositories are easier to reason about in isolation
- Independent versioning and deployment per service
- Clear ownership boundaries

**Cons:**
- Cross-package changes require coordinating changes across multiple repositories and PRs
- New engineers must clone and configure multiple repositories to work on the platform
- Dependency updates must be propagated manually across repos

### Option 2: Turborepo Monorepo (Selected)

All packages and services live in a single repository. Turborepo manages task orchestration and remote caching.

**Pros:**
- Cross-package refactors are significantly easier — a single PR can span multiple packages atomically
- New engineers only need to clone one repository to get the full platform
- Shared tooling, lint rules, and configs can be centralized

**Cons:**
- CI caching is more complex to configure and maintain correctly with Turborepo
- The repository will grow large over time as more packages are added

## Consequences

- **Positive:** Developer experience improves markedly for cross-package work. Onboarding is simpler since a single `git clone` gives engineers the entire codebase.
- **Negative:** The team must invest in understanding and maintaining Turborepo's caching configuration. Repository size will increase over time and may require attention (e.g., shallow clones, sparse checkouts) as the platform scales.
- **Action required:** Set up Turborepo with appropriate `turbo.json` pipeline configuration and enable remote caching (e.g., via Vercel or a self-hosted cache) to mitigate CI speed concerns.
