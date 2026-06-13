---
name: devops-plan
description: |
  Generate DevOps pipeline plans as markdown documents in .github/workflows/. Always use this skill when the user wants to: plan CI/CD pipelines, design GitHub Actions workflows, plan a DevOps setup, document a deployment pipeline, set up IaC automation, containerize an application pipeline, or add Claude-powered review or help workflows to a GitHub repository. Trigger on: devops plan, pipeline plan, CI/CD plan, GitHub Actions, workflow plan, deployment pipeline, IaC pipeline, container pipeline, automate deployments, claude review workflow, claude help workflow. When the user wants to "set up CI/CD", "plan the pipelines", or "add GitHub Actions" — that's this skill.
---

# DevOps Pipeline Planner

You help plan GitHub Actions workflows by producing markdown planning documents in `.github/workflows/`. Each document describes one pipeline in enough detail to implement it as a working YAML workflow file.

## Step 1: Gather project context

Before proposing any pipelines, understand what you're working with. Read the repository to infer as much as possible, then ask only about what you cannot determine:

**Infer from the repo (check before asking):**
- Primary language and runtime (look for `package.json`, `go.mod`, `requirements.txt`, `Dockerfile`, etc.)
- Existing workflows (scan `.github/workflows/*.yml`)
- IaC tool in use (look for `terraform/`, `*.tf`, `pulumi.yaml`, `cdk.json`, `*.bicep`)
- Container usage (look for `Dockerfile`, `docker-compose.yml`)

**Ask if not determinable:**
- Cloud provider and deployment target (e.g., AWS ECS, GCP Cloud Run, Azure App Service, Kubernetes)
- Container registry (e.g., ECR, GCR/Artifact Registry, GHCR, Docker Hub)
- IaC state backend (e.g., S3 + DynamoDB, GCS, Terraform Cloud) — only if IaC is in use
- Environments and promotion model (e.g., dev → staging → prod, or just main → prod)
- Any existing secrets or OIDC setup in the repo (to avoid conflicting with them)

Do not assume a cloud provider or registry. These choices drive nearly every implementation detail.

## Step 2: Propose the pipeline list

Present the following default set of pipelines and ask the user to confirm, remove, or add entries before you write anything:

```
Proposed pipelines:

1. claude-code-review   — Automated PR code review using Claude
2. claude-help          — Respond to @claude mentions in issues and PR comments
3. secret-scan          — Detect hardcoded credentials and secrets in commits using Gitleaks
4. sast-scan            — Static application security testing on pull requests using Semgrep
5. iac-ci               — Validate and plan IaC changes on pull requests
6. iac-cd               — Apply IaC changes on merge to main (with approval gate)
7. app-test             — Run the application test suite on pull requests
8. app-build            — Build and push a container image on merge to main
9. app-deploy           — Deploy the latest container image to the target environment

Confirm this list, or tell me which to add, remove, or rename before I write the plans.
```

Wait for explicit confirmation before proceeding. The user may:
- Remove pipelines that don't apply (e.g., no IaC, no containers)
- Add custom pipelines not in the default list
- Rename pipelines to match existing naming conventions

## Step 3: Survey existing workflow files

After confirmation, check what's already in the repo:

```bash
ls .github/workflows/ 2>/dev/null
```

For any confirmed pipeline, check if a `.yml` or `.md` planning file already exists for it. Update rather than overwrite — if a plan already exists, read it and increment its version.

If `.github/workflows/` doesn't exist yet:

```bash
mkdir -p .github/workflows
```

## Step 4: Write one markdown plan per pipeline

### File naming

Name each plan file after the pipeline slug:

| Pipeline | Plan file |
|----------|-----------|
| claude-code-review | `.github/workflows/claude-code-review.md` |
| claude-help | `.github/workflows/claude-help.md` |
| secret-scan | `.github/workflows/secret-scan.md` |
| sast-scan | `.github/workflows/sast-scan.md` |
| iac-ci | `.github/workflows/iac-ci.md` |
| iac-cd | `.github/workflows/iac-cd.md` |
| app-test | `.github/workflows/app-test.md` |
| app-build | `.github/workflows/app-build.md` |
| app-deploy | `.github/workflows/app-deploy.md` |

For custom pipelines added by the user, derive the filename from the pipeline name in lowercase kebab-case.

### Frontmatter format

Every plan file must begin with YAML frontmatter:

```markdown
---
title: "Pipeline Name"
version: 1.0.0
date: YYYY-MM-DD
authors:
  - Your Name
changelog:
  - version: 1.0.0
    date: YYYY-MM-DD
    author: Your Name
    changes: Initial version
---
```

When **updating** an existing file, increment the version (patch `x.x.1` for small edits, minor `x.1.0` for new sections, major `2.0.0` for significant rewrites), set today's date, and append a new changelog entry.

### Content structure for each plan file

Each plan file must cover:

**1. Purpose** — One sentence: what this workflow does and why it exists.

**2. Trigger** — When the workflow runs. Be explicit:
- Event type (`pull_request`, `push`, `issue_comment`, `workflow_dispatch`, etc.)
- Branch filters if applicable
- Path filters if applicable

**3. Jobs** — List each job with:
- Job name and `runs-on` runner
- Steps in order, naming the specific GitHub Action and version (e.g., `actions/checkout@v4`, `hashicorp/setup-terraform@v3`)
- For shell steps, the exact command(s) to run
- `needs:` dependencies between jobs if the workflow is multi-job

**4. Secrets and environment variables** — List every secret and env var the workflow needs, with a note on where each comes from (GitHub Actions secret, OIDC token, hardcoded value, etc.)

**5. Permissions** — List the `permissions:` block the workflow requires (e.g., `pull-requests: write`, `id-token: write`)

**6. Notes and decisions** — Call out any non-obvious choices: why a particular action was chosen, what approval mechanism is used, how the workflow integrates with others.

**Use diagrams where they help.** When a diagram would let a reader understand a pipeline's structure, job dependencies, or environment promotion model more quickly than prose, draw it in Mermaid format inside a fenced code block (` ```mermaid `). Pipeline flow charts and job dependency graphs are especially well-suited to Mermaid.

### Pipeline-specific guidance

**secret-scan**
Use [Gitleaks](https://github.com/gitleaks/gitleaks) (`gitleaks/gitleaks-action@v2`) — the most widely adopted OSS secret scanner. Trigger on `pull_request` (all types) **and** `push` to main so every commit path is covered.

Key configuration points:
- The action scans the diff on pull requests and the full commit range on push; no extra configuration needed for basic use.
- Supports a `.gitleaks.toml` allowlist at repo root to suppress known false positives (e.g., test fixtures, example keys). Note this in the plan so implementers know where to put suppression rules.
- The workflow must set `GITHUB_TOKEN` (automatically available) so the action can post a PR comment listing any findings. No additional secrets required for OSS use.
- Fail the job on any detected secret (`exit-code: 1`, which is the default). Never soften this to a warning — the entire value of secret scanning is blocking the merge.
- Alternative: [TruffleHog](https://github.com/trufflesecurity/trufflehog) (`trufflesecurity/trufflehog@v3`) scans full git history and is a strong complement when onboarding a repo with a long history. Mention it as an optional addition for the initial repo audit.

Permissions needed: `contents: read`, `pull-requests: write`.

**sast-scan**
Use [Semgrep](https://github.com/semgrep/semgrep) — the most widely adopted OSS SAST tool, supporting 30+ languages. Trigger on `pull_request` (all types). Run in OSS mode (no Semgrep Cloud account required):

```yaml
- uses: semgrep/semgrep-action@v1
  with:
    config: >-
      p/default
      p/owasp-top-ten
      p/secrets
```

Key configuration points:
- `p/default` covers the language-appropriate default rules; `p/owasp-top-ten` adds OWASP coverage; `p/secrets` adds a second layer of secret pattern matching on top of Gitleaks.
- Upload results as SARIF to GitHub Code Scanning (requires `security-events: write` permission and GitHub Advanced Security enabled for private repos):
  ```yaml
  - uses: github/codeql-action/upload-sarif@v3
    with:
      sarif_file: semgrep.sarif
  ```
- For public repos, GitHub Code Scanning is free. For private repos, note that it requires GitHub Advanced Security (GHAS) and suggest the user check their plan.
- Alternative: [CodeQL](https://github.com/github/codeql-action) (`github/codeql-action@v3`) is GitHub-native and deeply integrated into the Security tab. Recommend it as an alternative or complement for compiled languages (Java, C/C++, C#, Go) where CodeQL's inter-procedural analysis is stronger than Semgrep's. The two tools are complementary, not redundant.
- Do not set `continue-on-error: true` — security findings should block the PR merge.

Permissions needed: `contents: read`, `security-events: write` (for SARIF upload), `pull-requests: write` (for inline PR annotations).

**claude-code-review**
Use the `anthropics/claude-code-action` GitHub Action. Trigger on `pull_request` (types: `opened`, `synchronize`). The action posts a review comment to the PR. Required secret: `ANTHROPIC_API_KEY`. Recommend `claude-sonnet-4-6` as the default model unless the user specifies otherwise.

**claude-help**
Use the `anthropics/claude-code-action` GitHub Action in response to `issue_comment` events where the comment body contains `@claude`. Also handle `pull_request_review_comment` for inline PR comment replies. Required secret: `ANTHROPIC_API_KEY`. The action posts a reply comment. Permissions needed: `issues: write`, `pull-requests: write`.

**iac-ci**
Steps: checkout → setup IaC tool (use the official action for the tool: `hashicorp/setup-terraform`, `pulumi/actions`, etc.) → authenticate to cloud (prefer OIDC over long-lived keys) → `init` → `validate` → `plan` → post plan output as a PR comment. Trigger: `pull_request` targeting the main branch, with a path filter on the IaC directory.

**iac-cd**
Steps: checkout → setup IaC tool → authenticate to cloud → `init` → `apply -auto-approve`. Trigger: `push` to main, with path filter on IaC directory. Include an environment protection rule (GitHub Environments) for `production` requiring manual approval before apply. Note the state backend and locking mechanism.

**app-test**
Steps: checkout → setup language runtime → install dependencies → run tests. Trigger: `pull_request`. Include caching for the dependency manager (e.g., `actions/cache` for npm, pip, Go modules). If the test suite requires a database or service, use a `services:` container.

**app-build**
Steps: checkout → authenticate to container registry (prefer OIDC) → `docker/setup-buildx-action` → `docker/build-push-action` with cache-from/cache-to for layer caching. Tag the image with the Git SHA. Push to the configured registry. Trigger: `push` to main. Output the image URI for downstream workflows.

**app-deploy**
Steps: checkout → authenticate to cloud → pull the image tagged with the triggering commit SHA → update the deployment target (task definition revision, Cloud Run service, Kubernetes manifest, etc.). Trigger: `workflow_run` completing `app-build` on success, or `push` to main if simpler. Use GitHub Environments for the target environment to enable approval gates and environment-scoped secrets.

## Step 5: Update the README index

Write or update `.github/workflows/README.md` to index all plan files. The README must also have YAML frontmatter.

Format:

```markdown
---
title: "GitHub Workflows"
version: 1.0.0
date: YYYY-MM-DD
authors:
  - Your Name
changelog:
  - version: 1.0.0
    date: YYYY-MM-DD
    author: Your Name
    changes: Initial version
---

# GitHub Workflows

Pipeline plans for this repository. Each file describes one workflow in enough detail to implement it.

| Pipeline | File | Description |
|----------|------|-------------|
| claude-code-review | [claude-code-review.md](claude-code-review.md) | Automated PR code review using Claude |
| claude-help | [claude-help.md](claude-help.md) | Respond to @claude mentions in issues and PR comments |
| secret-scan | [secret-scan.md](secret-scan.md) | Detect hardcoded credentials and secrets using Gitleaks |
| sast-scan | [sast-scan.md](sast-scan.md) | Static application security testing using Semgrep |
```

## Step 6: Confirm with the user

List every file created or updated — filename, version bumped from/to, and a one-sentence summary. Call out any assumptions made (cloud provider, registry, IaC tool, model choice) so the user can correct them before implementation starts.
