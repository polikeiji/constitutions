---
title: "Use Turborepo Monorepo for New Platform"
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

# Use Turborepo Monorepo for New Platform

## Motivation

As we begin building the new platform, we need to decide how to structure source code across multiple packages. Without an early decision, teams default to different layouts — some spinning up separate repos, others adding packages ad-hoc — leading to inconsistent tooling, fragmented CI, and friction on cross-package work. Locking in a repository strategy now prevents expensive migration later and shapes how every engineer on the team works day-to-day.

## Decision Drivers

- **Developer experience:** Cross-package changes (e.g., updating a shared type used by three services) should be possible in a single commit without coordinating multiple pull requests or publishing intermediate package versions.
- **CI speed:** Build and test pipelines must stay fast as the codebase grows; wasted CI time compounds quickly across a growing team.
- **Onboarding:** New engineers should be productive quickly — ideally with a single clone and install step, not a multi-repo setup ritual.

## Options

### Option A: Polyrepo

Each package or service lives in its own Git repository. Teams own their repos independently, with shared code published to a package registry.

**Developer experience** (-) Cross-package refactors require coordinating multiple pull requests, publishing intermediate versions, and updating consumers one at a time. Studies and practitioner reports consistently flag this as a source of significant slowdown at scale. Teams under pressure tend to copy-paste shared code instead — accumulating drift and security-patch lag across dozens of repos.

**CI speed** (+) Each repo's CI pipeline is small and scoped; pipelines are independent and don't interfere with each other.

**CI speed** (-) No shared caching across repos; common tooling (linting, type-checking, test frameworks) is reinstalled and re-run redundantly in every repository.

**Onboarding** (-) New engineers must clone several repositories, follow potentially different setup docs for each, and configure separate environments before becoming productive. Missing a step in one repo is easy and hard to detect.

### Option B: Monorepo with Turborepo

All packages live in a single Git repository. Turborepo orchestrates tasks (build, lint, test) with content-hashed local and remote caching, running only the tasks affected by a given change.

Turborepo is actively maintained by Vercel, currently in its 2.x series (as of early 2026), with frequent releases adding features like visual package/task graphs, composable configuration, and microfrontend support. It is purpose-built for JavaScript/TypeScript stacks and is well-suited to teams of 5–50 packages.

**Developer experience** (+) Cross-package changes land in a single commit and a single pull request. Shared types, utilities, and configuration are trivially reusable without a publish step.

**CI speed** (+) Turborepo's task graph runs only affected packages. Remote caching means a CI job operating on already-built code downloads cached artifacts instead of recomputing — reducing redundant work significantly in practice.

**CI speed** (-) Remote caching requires infrastructure setup (Vercel's hosted cache or a self-hosted alternative). Local CI caches cannot be reused across ephemeral runners, so cache configuration requires deliberate effort to get right. In benchmarks, Turborepo's single-machine CI throughput is competitive but marginally slower than Nx on large task graphs.

**Onboarding** (+) One repo to clone. One install command. One set of tooling conventions. New engineers are productive from the same starting point as senior engineers.

**Onboarding** (-) As the repo grows larger over time, initial clone time and disk footprint increase. Shallow clones mitigate this for most workflows.

## Decision

We will use **a monorepo managed by Turborepo**.

The two drivers that tip the balance are developer experience and onboarding. Cross-package refactors — updating a shared interface and all consumers atomically — are dramatically simpler in a monorepo, and this will be a regular activity on the new platform. The single-clone onboarding experience also lowers the activation energy for new engineers meaningfully.

The main trade-off is CI caching complexity. We accept this: remote cache setup is a one-time infrastructure investment, and Turborepo's documentation and Vercel's hosted cache make it tractable. The repo growing large over time is a known but slow-moving risk that can be addressed with shallow clones and git sparse-checkout if it becomes a problem.

## Consequences

**Good:**
- Cross-package refactors land in a single PR with unified review and CI signal.
- Shared configuration (TypeScript config, ESLint, Prettier) is defined once and inherited across packages.
- Turborepo's task graph prevents running builds or tests for packages unaffected by a change.
- New engineers clone one repo, run one install, and have the full platform available immediately.

**Bad:**
- CI remote caching requires deliberate setup; without it, cache misses on ephemeral runners negate some CI speed benefits.
- The repository will grow in size over time as history accumulates across all packages; mitigated by shallow clones but not eliminated.
- Turborepo is optimised for JavaScript/TypeScript — if the platform later adds services in other languages, those packages will not benefit from Turborepo's task orchestration and may require supplementary tooling.

## Links

- [Turborepo documentation](https://turborepo.dev)
- [Turborepo 2.x blog](https://turborepo.dev/blog)
- [Monorepo vs Polyrepo — Spacelift guide](https://spacelift.io/blog/monorepo-vs-polyrepo)
