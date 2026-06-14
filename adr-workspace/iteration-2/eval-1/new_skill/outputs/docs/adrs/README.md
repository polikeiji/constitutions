---
version: 1.0.0
date: 2026-06-13
---

# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for this project. Each ADR captures the context, options considered, and rationale behind a significant technical decision.

To propose a new ADR, copy an existing file, assign the next sequence number, set status to `Proposed`, and open a pull request.

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-postgresql.md) | Use PostgreSQL as Primary Database | Accepted | Chosen over MongoDB for native ACID compliance (required by billing), team familiarity, and lower AWS RDS cost |
