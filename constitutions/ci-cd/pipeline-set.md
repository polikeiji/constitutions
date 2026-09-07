# The pipeline set

Which pipelines a repository carries, how they are named, and what each one guarantees.

The artifact is the workflow itself: `.github/workflows/<slug>.yml`, one file per pipeline,
the filename matching the pipeline name in lowercase kebab-case. A markdown document
describing a workflow to be implemented later is a second copy of the same design, and the
copy drifts from the file that actually runs. Where a pipeline's shape needs explaining, a
comment in the YAML or a Mermaid block beside it carries the explanation. What does get
written down beside a pipeline is in
[Documenting a workflow](documenting-workflows.md).

## The default set

| Pipeline | Guarantees |
|---|---|
| `claude-code-review` | Every pull request has an automated review on it before a human opens it |
| `claude-help` | An `@`-mention in an issue or PR comment gets an answer |
| `secret-scan` | No credential reaches the default branch — Gitleaks |
| `sast-scan` | No known-vulnerable pattern merges — Semgrep, `p/default` plus `p/owasp-top-ten` and `p/secrets` |
| `iac-ci` | Infrastructure changes are validated and their plan is readable on the pull request |
| `iac-cd` | Merged infrastructure changes are applied, behind an approval gate |
| `<component>-lint` | The component's formatter and linter pass on the merge candidate |
| `<component>-test` | The component's test suite passes on the merge candidate |
| `<component>-build` | The component builds from a clean checkout |
| `<component>-build-image` | The default branch produces a container image tagged with its commit SHA |
| `<component>-deploy` | That image, or that build output, reaches the target environment |

A repository takes the rows that apply to it — no IaC, no `iac-*`; no container image, no
`build-image`. The per-component rows are named `<component>-<stage>`, where the component
is the deployable thing (`backend`, `web`, `docs`) and the stage is one of `lint`, `test`,
`build`, `build-image`, `deploy`. A repository with one deployable still uses its name
rather than a generic `app`, so the second one does not force a rename of the first.
Anything added beyond the set is named the same way. The two agent workflows keep those
names whichever coding agent the action behind them runs.

A lane that is not a stage of anything — an image-registry purge, a runner-image build, an
access-list sync — sits outside the grid and takes a name that says what it does, in the
same lowercase kebab-case.
