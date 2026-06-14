---
version: 1.0.0
date: 2026-06-13
---

# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the platform. Each ADR documents a significant technical decision — the context that prompted it, the options that were considered, and the rationale for what was chosen.

New ADRs should be sequentially numbered and follow the template established by existing records.

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-turborepo-monorepo.md) | Use Turborepo Monorepo for New Platform | Accepted | Chosen over polyrepo for simpler cross-package refactoring and single-repo onboarding; CI remote caching accepted as a setup trade-off |
