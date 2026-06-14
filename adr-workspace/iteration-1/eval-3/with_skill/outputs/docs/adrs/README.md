---
version: 1.0.0
date: 2026-06-13
---

# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the platform. Each ADR captures the context, options considered, and rationale behind a significant technical decision.

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-turborepo-monorepo.md) | Use Turborepo Monorepo for Platform Codebase | Accepted | Chosen over polyrepo for easier cross-package refactoring and simpler onboarding; CI caching complexity is an accepted trade-off |
