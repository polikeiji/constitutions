# Batch process documentation

What a batch process's folder says about its stack, how and where it runs, its tests, and
the pipelines that ship it. The folder carries an application's sections, as
[tree-shape.md](tree-shape.md) sets out, and [applications.md](applications.md) governs
them; this file adds what a job has that a long-running application does not.

## Rules

### Batch process or pipeline

1. A job that runs product workload — moving, transforming, or producing data the product
   serves — is a batch process, even where a CI system's scheduler starts it. A scheduled
   workflow that only maintains the repository or its delivery — dependency updates, branch
   cleanup, a nightly rebuild — is a pipeline, and belongs in the `devops/` inventory. The
   test is what the job's failure breaks: the product, or the delivery of it.

### The stack

2. `tech-stack.md` follows [applications.md](applications.md) rules 1 and 2, and names the
   three pieces a job has that an application may not: the scheduler or orchestrator that
   starts it, the compute it runs on, and the runtime inside that compute.

### The execution layout

3. `architecture/` carries the execution layout, the `.drawio.svg`
   [diagrams.md](diagrams.md) rule 2 names, showing:
   - **the trigger** — a schedule, an event, an upstream job, or a manual run;
   - **the cadence** — as a label, *nightly 02:00 UTC* or *on every upload*;
   - **who or what triggers it** — the scheduler, an application, an operator, the job
     upstream;
   - **where it runs** — the environment and the compute resource, each drawn as a container
     around what runs in it;
   - **what it reads and writes** — applications, agents, databases, queues, storage, and
     external services, each connection labelled with what crosses it and in which
     direction.
4. The exact schedule or event filter lives in the file that registers it — a cron
   expression in infrastructure code, a filter in the trigger's configuration — and the
   explanation beside the drawing links it. A cron expression copied into prose is wrong as
   soon as someone moves the run by an hour, and nothing notices.
5. An operator who can start the job by hand is drawn as a user, with the credential and
   role that allow it, as [applications.md](applications.md) rule 5 requires of any user. A
   manual run is the one path into a job that skips what the schedule guarantees.
6. The run's own steps — extract, transform, load, retry — are a flow, and sit in
   `software-design/` as Mermaid. The layout says where the job stands among the things it
   touches; the flow says what it does once started.

### Operating it

7. Beside the drawing, briefly: whether a run is safe to repeat, and what rerunning a
   partly finished one does; how a failed or missed run is noticed, with a link to the alert
   or dashboard; and how long a run is expected to take, with a link to the timeout where
   one is configured. A job that fails silently is found by whoever is downstream of it,
   usually days later.
8. Rerunning or backfilling by hand is a procedure, and is a runbook in `guides/`.

### Tests and evidence

9. `tests.md` follows [applications.md](applications.md) rules 9–12, and adds what stands in
   for production input — fixtures, a sampled dataset, a seeded database — and how a run is
   exercised against it from trigger to final write.
10. Evidence of real runs is the scheduler's run history, linked beside the latest CI run of
    the tests. A job's tests can pass while its last three scheduled runs failed, and the run
    history is the half that shows it.

### The pipelines

11. The pipelines that build and deploy the job are listed in the Pipelines section
    [applications.md](applications.md) rule 7 requires, in the job's own `architecture/`.
    Where a CI scheduler also starts the job, as rule 1 allows, that workflow is listed there
    too: it is both what ships the job and what runs it.

## Rationale

An application announces its failures to the person using it; a batch process announces
them to nobody. Its users are downstream — a report that did not refresh, a table that
stopped filling — and they rarely know the job exists. So this file asks, beyond what an
application documents, for the answers that person needs once they trace a stale number back
to its source: what starts the job, where it runs, what it wrote, whether it ran, and whether
running it again is safe.
