# ADR 0001: Use GoodJob for Background Job Processing

**Status:** Accepted
**Date:** 2026-06-13
**Deciders:** Engineering Team, Ops Team

---

## Context

Our Rails application currently uses Sidekiq backed by Redis for background job processing. The ops team has raised concerns about the operational overhead of managing Redis as a separate infrastructure dependency. We need a background job solution that reduces operational complexity while maintaining reliability.

Key drivers for this decision:

- **Ops simplicity:** Eliminate the need for Redis and its associated management burden (provisioning, monitoring, failover, memory tuning).
- **Reliability:** Ensure durable, transactional job persistence.
- **Team familiarity:** Leverage the team's existing expertise with PostgreSQL rather than introducing another data store.

The candidates evaluated were:

1. **Keep Sidekiq with Redis** — status quo
2. **GoodJob** — PostgreSQL-backed job queue with a built-in web UI, actively maintained
3. **Que** — PostgreSQL-backed job queue, simpler feature set, less actively developed

---

## Decision

We will replace Sidekiq and Redis with **GoodJob** as our background job processing library.

GoodJob stores jobs in PostgreSQL using `pg_notify` and advisory locks for real-time job dispatch, meaning it operates entirely within our existing database infrastructure with no additional services required.

---

## Alternatives Considered

### Option 1: Keep Sidekiq with Redis (Status Quo)

**Pros:**
- No migration cost; team is already familiar with it
- Mature, battle-tested, excellent performance at high throughput
- Rich ecosystem and community support

**Cons:**
- Requires Redis as a separate infrastructure component
- Ops team must manage Redis availability, persistence, memory limits, and failover
- Two data stores to monitor, back up, and secure
- Job data is ephemeral in Redis by default — risk of data loss on Redis failure without explicit persistence configuration

**Verdict:** Rejected. The operational overhead of Redis is the primary pain point this decision addresses.

---

### Option 2: GoodJob

**Pros:**
- Runs entirely on PostgreSQL — no new infrastructure
- Jobs are stored as database rows, giving them full ACID guarantees and surviving application restarts or crashes
- Built-in web UI for monitoring queues, jobs, and errors (accessible via the Rails engine mount)
- Actively maintained with regular releases and a responsive maintainer
- ActiveJob-compatible, minimizing changes to existing job classes
- Supports concurrency, cron-style scheduled jobs, and multi-process execution modes

**Cons:**
- Higher database load than Redis under very high job throughput (thousands of jobs per second)
- `pg_notify` polling adds minor overhead compared to Redis's purpose-built pub/sub
- Smaller community than Sidekiq

**Verdict:** Accepted. Meets all three key drivers and fits our scale.

---

### Option 3: Que

**Pros:**
- PostgreSQL-backed — same ops simplicity benefit as GoodJob
- Uses `SKIP LOCKED` for efficient queue polling without advisory locks
- Lightweight and straightforward

**Cons:**
- Less actively maintained compared to GoodJob; slower response to Rails version compatibility issues
- No built-in UI — observability requires custom tooling or third-party dashboards
- Smaller community and fewer integrations

**Verdict:** Rejected in favor of GoodJob. Que's reduced maintenance activity and lack of a built-in UI make it the weaker choice given equivalent infrastructure benefits.

---

## Consequences

### Positive

- Ops team no longer needs to provision or manage Redis for job processing.
- Job state is stored durably in PostgreSQL, covered by existing backup and replication policies.
- Teams can inspect and manage jobs via GoodJob's web UI without additional tooling.
- Existing job classes require minimal changes since GoodJob is fully ActiveJob-compatible.
- Single data store simplifies local development setup and CI environments.

### Negative / Risks

- **Migration effort:** Existing Sidekiq job classes and configuration must be migrated. Any jobs enqueued in Redis at cutover will need to be drained or replayed.
- **Database load:** Background jobs will now compete with application queries for database connections and I/O. This should be monitored and connection pool sizing reviewed post-migration.
- **Throughput ceiling:** If job volume grows to very high levels (tens of thousands per second), GoodJob on PostgreSQL may require horizontal scaling strategies or a re-evaluation. This is not a current concern given our workload.
- **Operational change:** The ops team gains simpler infrastructure but must become familiar with GoodJob's configuration options (execution mode, number of threads, cron definitions).

### Neutral

- GoodJob supports several execution modes (async, external, server). We will use `server` mode running as a separate process (mirroring our current Sidekiq worker process model) for process isolation.
- Redis may remain in use for other purposes (e.g., caching, sessions) but will no longer be a hard dependency for job processing.

---

## Migration Plan (High Level)

1. Add `gem 'good_job'` and run the GoodJob database migrations to create the `good_jobs` table.
2. Update `config.active_job.queue_adapter = :good_job` in the Rails application configuration.
3. Drain the existing Sidekiq queues before the final cutover to ensure no jobs are lost.
4. Deploy with GoodJob running as a separate process (`bundle exec good_job start`).
5. Remove Sidekiq and Redis job-processing configuration; decommission Redis if no longer used elsewhere.
6. Monitor database connection counts, query latency, and job throughput after launch.

---

## References

- [GoodJob GitHub](https://github.com/bensheldon/good_job)
- [GoodJob Documentation](https://github.com/bensheldon/good_job#readme)
- [Que GitHub](https://github.com/que-rb/que)
- [Sidekiq](https://github.com/sidekiq/sidekiq)
- [ActiveJob Basics — Rails Guides](https://guides.rubyonrails.org/active_job_basics.html)
