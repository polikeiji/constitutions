# ADR 0001: Use PostgreSQL as Primary Database

**Date:** 2026-06-13
**Status:** Accepted

## Context

We are building a new SaaS product and needed to select a primary database. Two main candidates were evaluated: PostgreSQL and MongoDB.

MongoDB was considered for its flexible, schema-less document model, which can accelerate early-stage development when data shapes are still evolving.

PostgreSQL was considered for its maturity, ACID compliance, relational model, and broad operational familiarity within the team.

Key requirements driving this decision:
- **Billing integrity:** The product handles financial transactions that require strong consistency and atomicity guarantees.
- **Team expertise:** The engineering team has existing depth with relational databases and SQL.
- **Operational cost:** Infrastructure cost is a real constraint, particularly on AWS.

## Decision

We will use PostgreSQL as the primary database for this SaaS product.

## Rationale

- **ACID transactions:** Billing and financial operations require atomic, consistent, isolated, and durable transactions. PostgreSQL's native ACID guarantees make it the safer choice here; MongoDB's multi-document transactions exist but are a later addition and carry more operational overhead.
- **Team familiarity:** The team knows PostgreSQL well. Using a familiar technology reduces onboarding friction, lowers the risk of subtle misuse, and speeds up development.
- **Lower cost on AWS RDS:** PostgreSQL on AWS RDS is significantly cheaper to run than MongoDB Atlas at equivalent scale. This matters for unit economics as we grow.
- **Schema discipline:** While MongoDB's flexible schema was appealing for early-stage iteration, we concluded that enforcing schema structure earlier is a net positive — it surfaces data modeling issues sooner and makes the codebase easier to reason about long-term.

## Consequences

- All persistent data will be stored in PostgreSQL. Services that need key-value or document-style storage will use JSONB columns where appropriate, keeping everything in one system.
- Migrations will be managed explicitly (e.g., via a migration tool such as Flyway, Liquibase, or Alembic). Schema changes require deliberate versioned migrations.
- The team should not feel pressure to force a relational model onto data that is inherently document-shaped; JSONB is available for those cases.
- If a future use case arises that PostgreSQL handles poorly (e.g., high-cardinality time-series, graph traversal at scale), we will evaluate adding a purpose-specific store at that time rather than switching the primary database.
- MongoDB is not used in this project. If this decision needs to be revisited, a new ADR should be written.
