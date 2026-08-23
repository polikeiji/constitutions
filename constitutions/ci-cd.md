# CI/CD pipelines

Which pipelines a repository carries, what each one guarantees, and the choices that cannot
be read off the code.

The artifact is the workflow itself: `.github/workflows/<slug>.yml`, one file per pipeline,
the filename matching the pipeline name in lowercase kebab-case. A markdown document
describing a workflow to be implemented later is a second copy of the same design, and the
copy drifts from the file that actually runs. Where a pipeline's shape needs explaining, a
comment in the YAML or a Mermaid block beside it carries the explanation.

## The default set

| Pipeline | Guarantees |
|---|---|
| `claude-code-review` | Every pull request has an automated review on it before a human opens it |
| `claude-help` | An `@`-mention in an issue or PR comment gets an answer |
| `secret-scan` | No credential reaches the default branch — Gitleaks |
| `sast-scan` | No known-vulnerable pattern merges — Semgrep, `p/default` plus `p/owasp-top-ten` and `p/secrets` |
| `iac-ci` | Infrastructure changes are validated and their plan is readable on the pull request |
| `iac-cd` | Merged infrastructure changes are applied, behind an approval gate |
| `app-test` | The test suite passes on the merge candidate |
| `app-build` | The default branch produces a container image tagged with its commit |
| `app-deploy` | That image reaches the target environment |

A repository takes the rows that apply to it — no IaC, no `iac-*`; no image, no
`app-build`. Anything added beyond the set is named the same way. The two agent workflows
keep those names whichever coding agent the action behind them runs.

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
explicit and reviewable — a `.gitleaks.toml` allowlist entry, a Semgrep `nosem` comment — so
that dismissing a finding leaves a diff behind.

`secret-scan` covers pull requests and pushes to the default branch both; scanning one path
leaves the other open.

`sast-scan` uploads its SARIF to GitHub Code Scanning, which needs `security-events: write`
and — on a private repository — GitHub Advanced Security, a paid add-on. Nothing in a
repository reveals whether that is on the plan, so the upload step is the one part of the
set worth confirming before it is written. `p/secrets` overlaps Gitleaks on purpose: two
pattern sets over the same diff catch what one misses.

## Deploys pass through an environment

`iac-cd` and `app-deploy` run against a GitHub Environment, which is what carries the manual
approval gate and the environment-scoped secrets. An apply or a deploy that reaches
production without one has no gate rather than an open gate.

`app-deploy` deploys the tag `app-build` wrote — the triggering commit's SHA. A `latest` tag
makes the running version unattributable to a commit.
