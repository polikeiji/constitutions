# Writing a workflow

What the repository already answers, what has to be settled before a workflow can be
written, and the two rules a pipeline is not allowed to soften.

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

## Security scans block the merge

`secret-scan` and `sast-scan` fail the job on a finding. `continue-on-error`, a softened exit
code, or a warning-only mode removes the only thing either scan is for. Suppression stays
explicit and reviewable — a `.gitleaks.toml` allowlist entry, a Semgrep `nosemgrep` comment — so
that dismissing a finding leaves a diff behind.

`secret-scan` covers pull requests and pushes to the default branch both; scanning one path
leaves the other open.

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
