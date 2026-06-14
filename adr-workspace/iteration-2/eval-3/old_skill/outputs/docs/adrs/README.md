# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the platform. Each ADR captures the context, options considered, and rationale behind a significant technical decision.

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](./0001-use-turborepo-monorepo.md) | Use Turborepo Monorepo Structure | Accepted | All packages live in a single Turborepo-managed monorepo to simplify cross-package changes and engineer onboarding, at the cost of more complex CI caching configuration. |
