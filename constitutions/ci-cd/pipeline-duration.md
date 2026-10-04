# How long a pull request's pipelines take

How long a pipeline a pull request triggers may take, how that is measured, what may close
the gap when one takes longer, and which time is excepted because the repository does not
control it.

## The target

Every pipeline a pull request triggers finishes within **three minutes**, at the median of
its last twenty completed runs. The time is wall-clock, from the run's start to its end. A
reviewer waits for the runner's queue and its cold start as much as for the steps, so both
count.

A review waits on the slowest check, and a check that is always slow is the one a reviewer
learns to merge past. The median, not every run, carries the target: one run is slowed by a
noisy neighbour or a cold cache, and a defect that only a single run shows is not the one
this rule exists for. A skipped run — a path filter that did not match, a stacked pull
request's gate — finished nothing and is left out.

```bash
gh api "repos/<owner>/<repo>/actions/workflows/<file>/runs?per_page=100&status=completed" \
  --jq '[.workflow_runs[] | select(.conclusion == "success" or .conclusion == "failure")
         | (.updated_at | fromdate) - (.run_started_at | fromdate)][:20]
        | sort | .[length / 2 | floor] / 60'
```

A pipeline over the target is a defect, ticketed like a failing check. `iac-cd` and every
`<component>-deploy` run after the merge, where no reviewer waits on them, so the target does
not reach them.

## What may close the gap

The check stays what it was. A change made for speed shows that in its pull request: the
same tests ran, under the same thresholds, and coverage measured the same lines.

What may close the gap:

- **Parallelism** — test workers, a matrix, a larger runner, independent jobs that ran in
  sequence;
- **caching** dependencies and build outputs between runs;
- **faster tooling that gives the same result**, such as coverage measured through
  `sys.monitoring` rather than a trace function;
- **merging jobs** that each paid a runner's cold start for no isolation they needed;
- **removing a test or a step that exactly duplicates another check**, with the duplicate
  named in the pull request.

What may not: dropping, skipping or sampling tests, lowering a coverage or lint threshold,
moving a check to after the merge, or making it non-blocking. Each makes the pipeline faster
by making it check less, which is the trade this rule is written against. The scans' own
version of it is in [Writing a workflow](writing-a-workflow.md).

## Time the repository does not control

Some steps a pull request rightly waits on take as long as a system outside the repository
takes:

- **a build that runs on someone else's machine** — a registry's remote image build, a hosted
  build service, a push to a registry;
- **a cloud provider previewing or deploying resources** — a what-if, a plan that reads live
  provider state, a deployment the pull request's checks make;
- **a third-party service's queue or rate limit.**

A pipeline over the target only because of such a step is an exception rather than a
defect, on three conditions:

1. **The step is named beside the workflow**, in a comment at its top, with its measured
   median and the date it was measured. An exception nobody wrote down is a defect nobody
   ticketed.
2. **The rest meets the target with that step's time taken out.** Setup, the runner's cold
   start and the repository's own steps are still the repository's to keep fast.
3. **Whatever in the step can be cut on the repository's side has been:** an unchanged stack
   skipped, a build cached, a preview run only when its inputs changed.

Compiling an app on the runner is the repository's own work, not an exception, and neither
is a slow runner the project hosts itself, a missing cache, or a serial chain of jobs: each
is the repository's to fix. A run during a published outage of the CI provider or a hosted
service it calls is left out of the median, since it measures the outage.
