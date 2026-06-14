---
version: 1.0.0
date: 2026-06-13
---

# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for our SaaS product. Each ADR documents a significant technical or architectural decision: its context, the options considered, and the rationale for the choice made.

New ADRs should be placed in this directory using the naming convention `NNNN-short-title.md`, where `NNNN` is the next sequential number.

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-postgresql.md) | Use PostgreSQL as Primary Database | Accepted | Chosen over MongoDB for ACID compliance, team familiarity, and lower AWS RDS cost |
