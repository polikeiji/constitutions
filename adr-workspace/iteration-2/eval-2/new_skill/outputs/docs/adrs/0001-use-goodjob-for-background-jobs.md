---
title: "Use GoodJob for Background Job Processing"
adr: "0001"
status: Accepted
date: 2026-06-13
authors:
  - Engineering Team
deciders:
  - Engineering Team
  - Ops Team
changelog:
  - version: 1.0.0
    date: 2026-06-13
    author: Engineering Team
    changes: Initial version
---

# Use GoodJob for Background Job Processing

## Motivation

Our Rails application currently processes background jobs with Sidekiq, which requires a Redis instance. The ops team bears ongoing burden managing Redis: provisioning, monitoring, failover, and keeping it in sync with our deployment pipeline. Because our application already runs on PostgreSQL, every job we process requires two data stores where one would do. We need to choose a PostgreSQL-native job backend so we can eliminate Redis and simplify our infrastructure without regressing on reliability or developer experience.

## Decision Drivers

- **Ops simplicity:** Eliminate Redis as a runtime dependency; all job state must live in PostgreSQL, which we already operate.
- **Reliability:** Jobs must survive process crashes, database restarts, and deploy cycles; at-least-once delivery with transactional enqueue guarantees.
- **Team familiarity:** The team has strong PostgreSQL experience and minimal Redis expertise; new tooling should build on what we know.
- **Maintenance posture:** The chosen library must be actively maintained with a healthy contributor community.
- **Developer experience:** A built-in UI for inspecting and retrying jobs reduces support toil.

## Options

### Option A: GoodJob

GoodJob is a multithreaded, PostgreSQL-backed Active Job adapter for Rails (current version 4.18.2, released April 2026). It uses PostgreSQL's `LISTEN/NOTIFY` for near-instant job pickup and advisory locks to prevent double-execution. The project is maintained by a single primary author with broad community support; it averages a release every few days and shows an 80% issue closure rate with 947 merged pull requests as of mid-2026.

**Ops simplicity** (+) Runs entirely within PostgreSQL — no Redis, no separate service to provision or monitor. Deployed as a process inside the existing Rails app or as a standalone process using the same database credentials.  
**Reliability** (+) Jobs are enqueued inside the same database transaction as the triggering record change; no job is lost if the application crashes mid-request. LISTEN/NOTIFY delivers jobs 10–25x faster than polling-based alternatives.  
**Team familiarity** (+) Configuration, migrations, and debugging all happen in SQL and ActiveRecord, which the team uses daily. No new operational mental model required.  
**Maintenance posture** (+) Actively developed; releases tracked continuously through 2025–2026. Strong adoption in the Rails community.  
**Developer experience** (+) Ships a built-in web dashboard (mountable in the Rails router) for viewing queued, running, failed, and finished jobs. Supports cron-style recurring jobs natively.  
**Known limitations** (-) Advisory-lock query materializes up to 1,000 candidate jobs per cycle; queues with more than 100,000 enqueued jobs at once may see increased query cost. Not a concern at our current job volume, but worth monitoring if volume spikes significantly.

### Option B: Que

Que is a PostgreSQL-backed job queue that uses advisory locks for concurrency control. The canonical repository (`que-rb/que`) has seen minimal commit activity in 2025–2026, with community discussion noting that active development has largely stalled. A GoCardless fork exists but the long-term direction of both is unclear. Industry comparisons from 2025 consistently recommend GoodJob or Sidekiq over Que for new Rails projects.

**Ops simplicity** (+) Also PostgreSQL-only; no Redis required.  
**Reliability** (+) Advisory locks prevent double-processing; transactional enqueue is supported.  
**Team familiarity** (~) Lower-level API than GoodJob; requires more manual integration work to plug into Active Job conventions.  
**Maintenance posture** (-) Commit activity has dropped significantly; the primary maintainer appears inactive. Using a library approaching end-of-life creates future migration risk.  
**Developer experience** (-) No built-in dashboard. Operational visibility requires third-party tooling or custom instrumentation.

### Option C: Keep Sidekiq (status quo)

Sidekiq is the dominant Rails background job processor, backed by Redis and known for high throughput (thousands of jobs per minute). It has a first-party UI, excellent documentation, and a large community.

**Ops simplicity** (-) Requires Redis as a separate service. Our ops team currently spends time managing Redis uptime, replication, eviction policies, and credentials rotation. This is the core driver for the evaluation.  
**Reliability** (+) Mature and battle-tested at scale. At-least-once delivery with configurable retry strategies.  
**Team familiarity** (~) The team knows Sidekiq, but Redis expertise is shallow. Ongoing ops burden falls on a team that has already flagged Redis as a pain point.  
**Maintenance posture** (+) Actively maintained; Sidekiq Pro available for advanced features.  
**Developer experience** (+) Built-in web UI; rich ecosystem of plugins.

## Decision

We will adopt **GoodJob** as our Active Job backend, replacing Sidekiq and Redis.

GoodJob directly eliminates our primary pain point — Redis — while matching or exceeding Sidekiq's developer experience through its built-in dashboard and Active Job compatibility. The team's existing PostgreSQL expertise makes it the lowest-friction option operationally. Que was rejected because of declining maintenance activity and the absence of a built-in monitoring UI. Sidekiq was rejected because keeping Redis contradicts our stated goal of ops simplicity.

## Consequences

- **Good:** Redis is removed from the stack. Infrastructure cost and operational surface area shrink. All job state is visible in the same database we already query.
- **Good:** Jobs enqueued inside a database transaction are guaranteed to persist or roll back atomically with the triggering change — a reliability improvement over the Sidekiq/Redis model.
- **Good:** The GoodJob dashboard replaces the Sidekiq web UI with no additional integration cost.
- **Good:** Recurring (cron-style) jobs can be defined in Ruby without a separate scheduler process.
- **Bad:** GoodJob is not designed for extremely high job throughput (100,000+ concurrent enqueued jobs). If job volume grows significantly, we will need to monitor query performance on the jobs table and consider tuning `queue_select_limit`.
- **Bad:** Migration from Sidekiq requires a coordinated deploy: drain Sidekiq queues, deploy the GoodJob worker, switch the Active Job adapter. Any jobs enqueued in Redis during the cutover window must be accounted for.
- **Neutral:** GoodJob runs as a long-lived process (or within the Puma server in async mode for low-traffic apps). Our deployment configuration will need to be updated to start the GoodJob worker alongside the web process.

## Links

- [GoodJob GitHub repository](https://github.com/bensheldon/good_job)
- [GoodJob gem on RubyGems](https://rubygems.org/gems/good_job)
- [Better Stack: GoodJob vs Sidekiq](https://betterstack.com/community/guides/scaling-ruby/goodjob-vs-sidekiq/)
- [Better Stack: Using GoodJob in Rails](https://betterstack.com/community/guides/scaling-ruby/goodjob-background-jobs/)
- [Que gem on GitHub](https://github.com/que-rb/que)
