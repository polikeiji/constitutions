---
title: "Use GoodJob for Background Job Processing"
adr: 0001
status: Proposed
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

Our Rails application currently uses Sidekiq with Redis for background job processing. The operations team has raised concerns about the overhead of managing a separate Redis instance — including provisioning, monitoring, failover, and scaling. We want to evaluate Postgres-backed alternatives that reduce infrastructure complexity while maintaining reliability and developer experience.

## Decision Drivers

- **Ops simplicity**: Eliminate the need for a separate Redis instance; leverage the existing Postgres infrastructure.
- **Reliability**: Jobs must not be lost; the solution must handle failures, retries, and concurrency safely.
- **Team familiarity**: The team is experienced with Postgres and its operational characteristics; a Postgres-backed queue requires no new expertise.

## Options

### Option A: Keep Sidekiq + Redis

| Driver | Assessment |
|---|---|
| Ops simplicity | **Con** — Redis must be provisioned, monitored, backed up, and scaled separately from Postgres. The ops team already flags this as a pain point. |
| Reliability | **Pro** — Sidekiq is battle-tested with a very large production user base; Redis is fast and durable when configured correctly. |
| Team familiarity | **Neutral** — The team knows Sidekiq well, but not Redis operations; some tribal knowledge is needed to tune persistence settings. |

### Option B: GoodJob (Postgres-backed)

| Driver | Assessment |
|---|---|
| Ops simplicity | **Pro** — Jobs are stored in a Postgres table; no additional infrastructure beyond the existing database. |
| Reliability | **Pro** — Leverages Postgres ACID guarantees and `FOR UPDATE SKIP LOCKED` to provide at-least-once delivery. Concurrency and retries are well-handled. Active and responsive maintenance with frequent releases. |
| Team familiarity | **Pro** — Backed by Postgres, which the team already monitors and understands. GoodJob's codebase and configuration are Rails-idiomatic. Includes a built-in web UI for job visibility. |

### Option C: Que (Postgres-backed)

| Driver | Assessment |
|---|---|
| Ops simplicity | **Pro** — Also Postgres-backed; same infrastructure benefit as GoodJob. |
| Reliability | **Neutral** — Technically sound and uses advisory locks for job locking, but development pace has slowed significantly; fewer recent bug fixes and compatibility updates. |
| Team familiarity | **Neutral** — Postgres-backed, which is familiar. However, the smaller community and slower release cadence mean less documentation, fewer examples, and higher risk of future compatibility gaps with Rails upgrades. |

## Decision

We will adopt **GoodJob** (Option B) as our background job processor, replacing Sidekiq and Redis.

GoodJob best satisfies all three decision drivers simultaneously. It eliminates Redis from our infrastructure footprint (addressing the ops team's primary complaint), uses Postgres's battle-tested durability and locking primitives for reliability, and aligns with the team's existing Postgres expertise. Its active maintenance, Rails-idiomatic design, and built-in web UI reduce onboarding friction compared to Que while delivering equivalent ops simplicity.

Although Sidekiq is highly reliable, the operational cost of Redis is not justified when a Postgres-backed alternative of GoodJob's quality is available.

## Consequences

**Positive:**
- Redis instance and all associated operational overhead (monitoring, failover, backup) can be decommissioned.
- Job data is persisted in Postgres, simplifying backup and disaster-recovery procedures (jobs are included in existing database backups).
- GoodJob's web UI provides built-in visibility into queued, running, and failed jobs without a separate tool.
- Simpler local development setup — no Redis required to run background jobs.

**Negative:**
- Background job load will increase Postgres query volume; database capacity planning must account for this.
- Migration from Sidekiq requires re-enqueuing or draining existing jobs before cutover to avoid data loss; a careful deployment plan is needed.
- GoodJob's throughput ceiling is lower than Sidekiq + Redis for very high job volumes — this should be benchmarked against our workload before full rollout.
- Active Record dependency means GoodJob is tightly coupled to Rails; any future move away from Rails would require re-evaluating this decision.

## Links

- [GoodJob GitHub](https://github.com/bensheldon/good_job)
- [GoodJob documentation](https://goodjob-docs.herokuapp.com/)
- [Que GitHub](https://github.com/que-rb/que)
- [Sidekiq documentation](https://sidekiq.org/)
