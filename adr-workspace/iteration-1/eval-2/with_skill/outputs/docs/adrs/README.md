---
version: 1.0.0
date: 2026-06-13
---

# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for this project. Each ADR documents the context, options considered, and rationale behind a significant technical decision.

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-goodjob-for-background-jobs.md) | Use GoodJob for Background Job Processing | Accepted | Chosen over Sidekiq+Redis and Que to eliminate Redis infrastructure, leveraging existing PostgreSQL for reliable, ops-simple background job processing |
