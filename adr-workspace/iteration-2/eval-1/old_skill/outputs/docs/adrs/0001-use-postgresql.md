---
title: "Use PostgreSQL as Primary Database"
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

## Motivation

The team is building a new SaaS product and needs to select a primary database. Two strong candidates were evaluated: PostgreSQL and MongoDB. This ADR documents the rationale for choosing PostgreSQL.

## Decision Drivers

1. **Team familiarity** — The existing team has deep experience with PostgreSQL and limited experience with MongoDB.
2. **ACID transactions** — The product includes a billing subsystem that requires strong transactional guarantees.
3. **Operational cost** — Infrastructure costs on AWS are a priority concern, especially at early stages.
4. **Schema discipline** — Maintaining a consistent, well-defined data model is preferred over flexible, schemaless storage.

## Options

### Option A: PostgreSQL

| Decision Driver | Pro | Con |
|---|---|---|
| Team familiarity | Team knows it well; faster onboarding and debugging | — |
| ACID transactions | Full ACID compliance; ideal for billing and financial data | — |
| Operational cost | AWS RDS for PostgreSQL is cost-effective; well-supported managed tier | — |
| Schema discipline | Enforces schema via DDL; prevents data inconsistency | Schema migrations require planning; less flexible for rapid model changes |

### Option B: MongoDB

| Decision Driver | Pro | Con |
|---|---|---|
| Team familiarity | — | Team has limited MongoDB experience; steeper learning curve |
| ACID transactions | Multi-document transactions available since v4.0 | Less mature than PostgreSQL; more complex to configure correctly for billing |
| Operational cost | — | MongoDB Atlas is significantly more expensive than AWS RDS at comparable tiers |
| Schema discipline | Flexible schema is useful for rapidly evolving data models | Lack of enforced schema increases risk of inconsistent or invalid data |

## Decision

**Use PostgreSQL as the primary database.**

PostgreSQL wins on every decision driver. The team's existing expertise reduces risk and accelerates delivery. ACID transactions are a hard requirement for the billing system and PostgreSQL provides them robustly. AWS RDS for PostgreSQL is meaningfully cheaper than MongoDB Atlas, which matters at the SaaS product's current stage. Finally, the team prefers schema discipline to catch data model issues early rather than at query time.

MongoDB's flexible schema was acknowledged as appealing for early-stage iteration, but the team judged that the discipline imposed by a defined schema is a net positive given the financial data involved.

## Consequences

### Good

- Team can move quickly without a learning curve on a new database system.
- Billing features can rely on ACID transactions without additional workarounds.
- Lower monthly infrastructure costs on AWS RDS vs. MongoDB Atlas.
- Enforced schema reduces the surface area for data integrity bugs.
- Rich ecosystem of PostgreSQL tooling (pg_dump, pgAdmin, psql, extensions) is immediately available to the team.

### Bad

- Schema migrations must be planned and executed carefully as the data model evolves (tooling like Flyway or Liquibase recommended).
- Less natural fit for any future features that require truly schemaless or document-style storage (can be partially addressed with PostgreSQL's JSONB column type).
- Team loses access to MongoDB-specific features such as native full-text search and flexible aggregation pipelines (PostgreSQL equivalents exist but differ).

## Links

- [PostgreSQL ACID compliance documentation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [AWS RDS for PostgreSQL pricing](https://aws.amazon.com/rds/postgresql/pricing/)
- [MongoDB Atlas pricing](https://www.mongodb.com/pricing)
