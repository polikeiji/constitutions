---
title: "Use GoodJob for Background Job Processing"
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

## Motivation

Our Rails application currently processes background jobs with Sidekiq backed by Redis. The operations team is burdened by maintaining Redis as a separate piece of infrastructure — provisioning, monitoring, and ensuring its availability adds overhead that is disproportionate to its value given that we already operate PostgreSQL. We need to select a Postgres-backed job queue that eliminates Redis while meeting our reliability and developer-experience requirements.

## Decision Drivers

- **Ops simplicity:** Eliminate Redis; run the job queue entirely on existing PostgreSQL infrastructure
- **Reliability:** Jobs must survive process restarts and not be lost; at-least-once delivery semantics required
- **Team familiarity:** The team has deep PostgreSQL expertise; preference for tooling that builds on that
- **Active maintenance:** The library must be actively maintained with timely security and compatibility patches
- **Developer experience:** A built-in UI for inspecting and retrying jobs is desirable

## Options

### Option A: GoodJob

GoodJob is a multithreaded, Postgres-backed ActiveJob adapter with a built-in dashboard.

**Ops simplicity** (+) Runs entirely on PostgreSQL; no additional service to provision or monitor
**Reliability** (+) Uses Postgres `FOR UPDATE SKIP LOCKED` for safe concurrent dequeuing; jobs are durable within the same transactional guarantees as application data
**Team familiarity** (+) Standard ActiveRecord migrations and models; the team can reason about job state using familiar Postgres tooling
**Active maintenance** (+) Actively developed with frequent releases; Rails compatibility kept up to date
**Developer experience** (+) Ships with a web UI (`/good_job`) for inspecting queues, retrying failed jobs, and viewing metrics without additional tooling

### Option B: Que

Que is a Postgres-backed job queue that stores jobs in a Postgres table and uses advisory locks for dequeuing.

**Ops simplicity** (+) Also Postgres-only; eliminates Redis
**Reliability** (+) Advisory-lock-based dequeuing is reliable; jobs survive process crashes
**Team familiarity** (+) Postgres-native; familiar mental model for the team
**Active maintenance** (-) Less actively developed; Rails adapter lags behind upstream Que at times; fewer recent commits and releases
**Developer experience** (-) No built-in UI; monitoring requires third-party tooling or custom queries

### Option C: Continue with Sidekiq + Redis

**Ops simplicity** (-) Redis must be provisioned, monitored, and backed up separately from PostgreSQL; the ops team's primary objection
**Reliability** (+) Battle-tested at scale; broad industry adoption
**Team familiarity** (+) Team already uses it; no migration cost
**Active maintenance** (+) Actively maintained commercial and open-source tiers
**Developer experience** (+) Mature UI (Sidekiq Web); large ecosystem of plugins

## Decision

We will adopt **GoodJob** as our background job processor.

GoodJob directly satisfies our top driver — ops simplicity — by running entirely on PostgreSQL, removing Redis from our infrastructure entirely. It matches our reliability needs through proven Postgres locking primitives and ActiveJob integration. Its active maintenance record and built-in dashboard address developer-experience requirements without additional tooling. Que offers a similar ops story but falls short on maintenance activity and lacks a UI. Continuing with Sidekiq would preserve the Redis burden the ops team needs to shed.

## Consequences

- **Good:** Redis can be decommissioned; ops team owns one fewer service.
- **Good:** Job state is visible and inspectable using standard Postgres tooling and the GoodJob dashboard.
- **Good:** Jobs are written or migrated as standard ActiveJob classes; GoodJob is a drop-in ActiveJob adapter.
- **Good:** Transactional job enqueuing (enqueue a job inside a database transaction) is supported naturally.
- **Bad:** GoodJob performance at very high job throughput (millions per day) is lower than Redis-based queues. This is acceptable for our current and projected workload.
- **Bad:** We must migrate existing Sidekiq jobs and scheduled crons to GoodJob's API; a one-time migration effort is required.
- **Bad:** PostgreSQL takes on additional load from job polling and locking. Capacity should be reviewed after rollout.

## Links

- [GoodJob documentation](https://github.com/bensheldon/good_job)
- [Que documentation](https://github.com/que-rb/que)
