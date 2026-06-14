---
title: "Use PostgreSQL as Primary Database"
adr: "0001"
status: Accepted
date: 2026-06-13
authors:
  - Team
deciders:
  - Team
changelog:
  - version: 1.0.0
    date: 2026-06-13
    author: Team
    changes: Initial version
---

# Use PostgreSQL as Primary Database

## Motivation

We are building a new SaaS product and need to select a primary database before development begins in earnest. The product includes a billing subsystem that requires reliable, multi-step transactions — getting this wrong risks data inconsistency in financial records. We must choose now so infrastructure, ORM tooling, and data modelling can proceed in a single direction.

## Decision Drivers

- **ACID correctness:** Billing flows require multi-step transactions that are atomic and durable by default, not as an opt-in mode.
- **Team familiarity:** The engineering team has production experience with relational databases, specifically PostgreSQL; no one has deep MongoDB operations experience.
- **Operational cost:** We need a managed service on AWS; cost must stay within an early-stage infrastructure budget.
- **Schema discipline:** We want the database to enforce data shape, not leave validation entirely to application code.
- **Ecosystem maturity:** ORM support, migration tooling, and community knowledge must be readily available.

## Options

### Option A: PostgreSQL

PostgreSQL 18 is the current stable major release (as of mid-2026), with PostgreSQL 19 in beta. The project follows a 5-year LTS policy per major version and ships minor patch releases at least quarterly — an actively maintained, predictable cadence.

**ACID correctness** (+) ACID compliance is built into the engine at all levels, not a feature you enable. Every write is transactional by default, making it the natural fit for billing.

**Team familiarity** (+) Multiple engineers have prior production PostgreSQL experience. Onboarding is faster and risk of operational mistakes is lower.

**Operational cost** (+) AWS RDS for PostgreSQL costs roughly $25/month at the entry tier and ~$261/month for a 4 vCPU / 16 GB instance — significantly cheaper than equivalent MongoDB Atlas tiers (≈$57/month entry, ≈$759/month mid-range).

**Schema discipline** (+) Relational constraints, foreign keys, and typed columns enforce correctness at the storage layer. Migrations can be reviewed and version-controlled.

**Ecosystem maturity** (+) Extensive ORM support (Prisma, SQLAlchemy, ActiveRecord, GORM), mature migration tools (Flyway, Liquibase, Alembic, pgroll), and a very large community. Platforms like Supabase and Neon now offer managed PostgreSQL with near-Atlas operational simplicity.

**Schema migrations** (-) DDL changes acquire table locks and can cause brief downtime in high-concurrency production scenarios if not handled carefully. Zero-downtime migration patterns (lock_timeout + retries, concurrent index creation, tools like pg_osc) exist but require team discipline.

### Option B: MongoDB

MongoDB is actively maintained; multi-document ACID transactions have been available since v4.0 (2018) and have matured.

**ACID correctness** (-) Multi-document transactions exist but carry performance overhead and a 60-second time limit. ACID is an opt-in mode, not the default — a meaningful distinction when billing correctness is a hard requirement.

**Team familiarity** (-) No one on the team has deep MongoDB operations experience. Document modelling patterns, index design, and aggregation pipelines have a non-trivial learning curve relative to our existing SQL skills.

**Operational cost** (-) MongoDB Atlas M10 costs ~$57/month at the entry tier and ~$759/month for a comparable mid-range instance on Atlas — roughly 2–3× more expensive than AWS RDS PostgreSQL for equivalent capacity.

**Schema discipline** (-) Flexible schema is a selling point for rapid prototyping but a liability when correctness matters. Validation rules exist but are less expressive than relational constraints and require deliberate effort to maintain.

**Ecosystem maturity** (+) Mongoose and official drivers are well-established. The flexible document model is genuinely superior for unstructured or highly variable data — a real advantage for certain workloads, just not this one.

## Decision

We will use **PostgreSQL** (managed via AWS RDS) as the primary database for this product.

PostgreSQL wins on every driver that matters most to us: it provides native, unconditional ACID compliance (critical for billing), the team can operate it confidently from day one, and it costs meaningfully less to run on AWS than a comparable MongoDB Atlas tier. MongoDB's flexible schema was appealing, but our need for schema discipline and the cost differential remove the main reasons to accept the familiarity and transaction trade-offs it brings.

## Consequences

**Good:**
- Billing transactions are safe by default; no special transaction mode required.
- The team can move quickly without a new operational learning curve.
- Infrastructure cost stays low at early-stage scale; RDS pricing scales predictably.
- Standard SQL means queries, reporting, and analytics tooling (Metabase, dbt, Redash) work without adapters.
- Rich migration tooling supports safe schema evolution over time.

**Bad:**
- Schema migrations require care to avoid locking downtime in production. The team must adopt safe DDL practices (lock_timeout, concurrent index builds, incremental rollouts) as the product scales.
- Horizontal write scaling (sharding) is more complex in PostgreSQL than in MongoDB if we ever reach that scale. We can address this with Citus or Aurora if needed — not a concern at launch.
- Schema flexibility is limited; adding fields or restructuring data requires explicit migrations, not just writing new documents.

## Links

- [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/)
- [Zero-downtime schema migration patterns for PostgreSQL](https://postgres.ai/blog/20210923-zero-downtime-postgres-schema-migrations-lock-timeout-and-retries)
- [MongoDB vs PostgreSQL 2026 (tech-insider.org)](https://tech-insider.org/mongodb-vs-postgresql-2026/)
