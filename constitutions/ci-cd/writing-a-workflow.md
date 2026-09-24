# Writing a workflow

What the repository already answers, what has to be settled before a workflow can be
written, which pull requests a pipeline runs on, and the two rules a pipeline is not allowed
to soften.

## What the repository already answers

Language and runtime (`package.json`, `go.mod`, `requirements.txt`), the workflows already
present, the IaC tool (`*.tf`, `pulumi.yaml`, `cdk.json`, `*.bicep`), and whether images are
built (`Dockerfile`, `docker-compose.yml`) are read rather than asked about.

## What cannot be inferred

The cloud provider and deployment target, and the container registry. Those two drive nearly
every detail beneath them — the auth step, the image URI, the deploy verb — and no file
reliably reveals either. Two more join them once IaC or a second environment is in play: the
state backend and its locking, and the promotion model (`dev → staging → prod`, or
`main → prod`). Guessing any of the four yields a workflow that reads as finished and cannot
run.

## What each workflow settles

Its trigger — event type, with branch and path filters wherever it should not fire on every
change. Its jobs, each naming a runner, its actions at a pinned major version, and its
`needs:` edges. A `permissions:` block scoped per job to the narrowest set that works, since
the default token grants more than most jobs use. And every secret and variable with its
origin: cloud credentials come from OIDC (`id-token: write`) rather than long-lived keys
wherever the provider supports it.

## Pull requests stacked on another branch

A pipeline a pull request triggers runs its jobs only on a pull request whose own base is
the default branch. A stacked pull request is checked once it reaches the bottom of its
stack, where its diff against the default branch is what merges; checking it on every push
and restack before then repeats that work once per pull request in the stack, and one
restack of a long stack fills the runner pool.

The gate is a job-level `if:` on the pull request's own base, letting every other event
through so a manual run still works:

```yaml
jobs:
  test:
    if: github.event_name != 'pull_request' || github.event.pull_request.base.ref == 'main'
    concurrency:
      group: ${{ github.workflow }}-test-${{ github.event.pull_request.number || github.run_id }}
      cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

It reads `github.event.pull_request.base.ref`, not `github.base_ref`: in a GitHub native
stack, workflows run as if every pull request targeted the stack's trunk, so `base_ref` is
the default branch all the way up the stack and a gate on it skips nothing. It sits on the
job rather than in `on.pull_request.branches`, because a workflow that never starts leaves a
required check waiting as *Expected*, while a skipped job satisfies it.

`edited` stays out of the trigger's `types`. It would start the checks when a stacked pull
request is retargeted to the default branch without a push, but every title or body edit
fires it too, and the skipped runs those edits start are listed over the real results in
the pull request's checks. The push that follows a retarget is what runs the checks, so a
stack rebased by hand is retargeted first and pushed second.

A pull request's runs share one concurrency group, keyed on its number, and a new push
cancels the run it supersedes, since a restack otherwise queues a stale run behind every
fresh one. A run on a push to the default branch falls back to a group of its own and is
never cancelled: a pipeline that checks only its push's range would leave the cancelled
push's commits unchecked.

## Security scans block the merge

`secret-scan` and `sast-scan` fail the job on a finding. `continue-on-error`, a softened exit
code, or a warning-only mode removes the only thing either scan is for. Suppression stays
explicit and reviewable — a `.gitleaks.toml` allowlist entry, a Semgrep `nosemgrep` comment — so
that dismissing a finding leaves a diff behind.

`secret-scan` covers pull requests and pushes to the default branch both; scanning one path
leaves the other open. On pull requests both scans take the gate above like every other
pipeline, and neither path opens: a stacked pull request's commits reach the default branch
only through the pull request then at the bottom of the stack, which both scans read over
`<default>..HEAD` and block. What the gate gives up is timing — a secret pushed to a stacked
branch is caught when its pull request reaches the bottom rather than on its first push,
and sits on the remote until then.

`sast-scan` uploads its SARIF to GitHub Code Scanning, which needs `security-events: write`
and — on a private repository — GitHub Advanced Security, a paid add-on. Nothing in a
repository reveals whether that is on the plan, so the upload step is the one part of the
set worth confirming before it is written. `p/secrets` overlaps Gitleaks on purpose: two
pattern sets over the same diff catch what one misses.

## Deploys pass through an environment

`iac-cd` and every `<component>-deploy` run against a GitHub Environment, which is what
carries the manual approval gate and the environment-scoped secrets. An apply or a deploy
that reaches production without one has no gate rather than an open gate.

A `<component>-deploy` ships the SHA tag its `build-image` wrote — the triggering commit's.
A `latest` tag makes the running version unattributable to a commit.
