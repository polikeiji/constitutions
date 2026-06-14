---
title: "Use PostgreSQL as Primary Database"
adr: 0001
status: Accepted
date: 2026-06-13
authors:
  - Engineering Team
deciders:
  - Engineering Team
changelog:
  - version: 1.0.0
    date: 2026-06-13
    author: Engineering Team
    changes: Initial version
---

# Use PostgreSQL as Primary Database

## Motivation

We are building a new SaaS product and need to select a primary database before development begins. The choice will shape our data model, operational setup, and the guarantees available to critical features like billing. Delaying this decision blocks schema design and infrastructure provisioning.

## Decision Drivers

- **Team familiarity:** The engineering team has existing production experience with PostgreSQL; onboarding friction should be minimized.
- **ACID transactions:** Billing workflows require strong transactional guarantees — partial writes or eventual consistency are not acceptable.
- **Operational cost:** We are running on AWS and need a cost-effective managed option within budget constraints.
- **Schema discipline:** We want the database to enforce data integrity rather than relying solely on application-level validation.
- **Ecosystem maturity:** Tooling for migrations, ORMs, and observability should be well-established.

## Options

### Option A: PostgreSQL

**Team familiarity** (+) Multiple engineers have hands-on production PostgreSQL experience; no ramp-up required.  
**ACID transactions** (+) Full ACID compliance with serializable isolation; safe for multi-step billing operations.  
**Operational cost** (+) AWS RDS for PostgreSQL is significantly cheaper than MongoDB Atlas at comparable storage and compute tiers.  
**Schema discipline** (+) Strongly typed, enforced schema with constraints, foreign keys, and check constraints built in.  
**Ecosystem maturity** (+) Mature migration tools (Flyway, Liquibase, sqitch), broad ORM support, deep AWS integration.

### Option B: MongoDB

**Team familiarity** (-) Team has limited MongoDB experience; operational patterns (indexing strategy, aggregation pipelines) would require learning.  
**ACID transactions** (~) Multi-document transactions added in v4.0, but the default document model encourages patterns that work around them; more error-prone for billing logic.  
**Operational cost** (-) MongoDB Atlas pricing is higher than RDS PostgreSQL for equivalent workloads at our projected scale.  
**Schema discipline** (-) Flexible schema is a double-edged sword: rapid early iteration is easier, but enforcing invariants requires application-layer validation discipline that is easy to skip.  
**Ecosystem maturity** (+) Rich document query model is well-suited for hierarchical or highly variable data shapes; mature drivers available.

## Decision

We will use **PostgreSQL** as our primary database.

PostgreSQL wins on every driver that matters most to us right now: the team knows it, it provides the ACID guarantees billing requires, and it is cheaper to operate on AWS RDS than MongoDB Atlas. MongoDB's flexible schema was appealing for early iteration speed, but the team concluded that schema discipline is a net positive — it surfaces data modeling problems early rather than letting them accumulate silently in document variance. The trade-off we accept is less flexibility for documents with highly variable shapes, which we do not anticipate needing in the near term.

## Consequences

- **Good:** Billing and financial workflows can rely on serializable transactions with no special workarounds.
- **Good:** The team can be productive immediately without an onboarding period on a new database.
- **Good:** Lower infrastructure cost on AWS RDS relative to MongoDB Atlas frees budget for other services.
- **Good:** Foreign keys, constraints, and typed columns prevent a class of data integrity bugs at the database layer.
- **Bad:** A rigid schema means any structural change requires a migration; teams must adopt a migration-as-code discipline from day one.
- **Bad:** Storing highly hierarchical or polymorphic data (e.g., flexible product configuration objects) may require JSONB columns or additional design care.
- **Bad:** If our data access patterns shift heavily toward document-style reads at scale, we may need to revisit this decision.

## Links

- [AWS RDS PostgreSQL pricing](https://aws.amazon.com/rds/postgresql/pricing/)
- [MongoDB Atlas pricing](https://www.mongodb.com/pricing)
