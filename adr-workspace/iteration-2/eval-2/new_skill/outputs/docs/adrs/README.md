---
version: 1.0.0
date: 2026-06-13
---

# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the Rails application. ADRs capture the context, options considered, and rationale behind significant technical decisions so future engineers understand not just *what* was chosen but *why*.

For guidance on writing new ADRs, follow the team's ADR template and naming convention: `NNNN-short-title.md`.

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-goodjob-for-background-jobs.md) | Use GoodJob for Background Job Processing | Accepted | Adopted GoodJob (PostgreSQL-backed) to replace Sidekiq and eliminate Redis from the infrastructure stack, driven by ops simplicity and team familiarity with PostgreSQL |
