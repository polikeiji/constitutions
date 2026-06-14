# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the project. Each ADR documents a significant technical decision, its context, the options considered, and the rationale for the choice made.

## Index

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](./0001-use-postgresql.md) | Use PostgreSQL as Primary Database | Accepted | PostgreSQL selected over MongoDB for team familiarity, ACID transaction support for billing, lower AWS RDS cost, and schema discipline. |

## What is an ADR?

An Architecture Decision Record captures a single architectural decision. It includes the context that motivated the decision, the options evaluated, and the reasoning behind the choice. ADRs are immutable once accepted — if a decision changes, a new ADR supersedes the old one.

## Creating a new ADR

1. Copy an existing ADR as a template.
2. Increment the numeric prefix (`NNNN`) by one.
3. Use kebab-case for the filename: `NNNN-short-title.md`.
4. Set `status: Proposed` until the decision is ratified.
5. Add a row to the index table above.
