---
name: eval-pipeline-plan
description: |
  Generate evaluation pipeline plans for GenAI applications. Always use this skill when the user wants to: plan an evaluation pipeline, design LLM evaluation, create eval plans for agents or skills, set up LangSmith evaluation, plan evaluation datasets, or plan GenAI evaluation deployment. Trigger on: eval plan, evaluation pipeline, LLM evaluation, agent evaluation, skill evaluation, LangSmith, evaluation dataset, eval deployment, Azure ML evaluation, MLflow evaluation. When the user says "plan eval pipelines", "create evaluation plans", "set up evals for our agents", or "plan how to evaluate this application" — that's this skill.
---

# Evaluation Pipeline Planner

You help plan GenAI evaluation pipelines by producing a structured set of markdown documents in `docs/evaluation_plans/`. Each document describes one aspect of the evaluation in enough detail to implement it. The default evaluation platform is **LangSmith** and the default cloud deployment target is **Azure Machine Learning** with **MLflow** for trace collection and score visualization.

**Every markdown file you create must begin with a YAML frontmatter header** containing `title`, `version`, `date`, `authors`, and `changelog`. See the [Frontmatter format](#frontmatter-format) section for the required structure. When updating an existing file, always increment the version and append a changelog entry — never write a file without this header.

## Step 1: Survey the codebase

Before writing any plans, read the project to understand what you're evaluating.

**Find agents:**

```bash
find . -type f -name "*.py" | xargs grep -l "AgentExecutor\|langgraph\|LangChain\|ChatModel\|LLMChain\|@agent\|class.*Agent" 2>/dev/null | head -20
find . -type d -name "agents" 2>/dev/null
```

**Find skills:**

```bash
find . -type f -name "SKILL.md" -o -name "skill*.py" -o -name "*_skill.py" 2>/dev/null | head -20
find . -type d -name "skills" 2>/dev/null
```

**Find entry points (end-to-end I/O):**

```bash
find . -type f \( -name "main.py" -o -name "app.py" -o -name "cli.py" \) 2>/dev/null | head -10
```

**Find existing evaluation plans:**

```bash
find docs/evaluation_plans -name "*.md" 2>/dev/null | sort
```

**Find existing model configuration:**

```bash
find . -name "*.yaml" -o -name "*.yml" | xargs grep -l "model\|llm\|openai\|anthropic\|azure" 2>/dev/null | head -10
```

Read any files you find to understand the agents, their tools, input/output schemas, and AI models in use. Record:
- A list of **agent names** and what each one does
- A list of **skill names** and what each one does
- The **end-to-end application name**, its input format, and its output format
- Which **AI models** each component uses (provider, model name, parameters)

## Step 2: Confirm the evaluation scope

Present a proposed evaluation scope table and wait for confirmation:

```
Proposed evaluation targets:

Agents:
  1. <agent-name>    — <one-line description>
  2. ...

Skills:
  1. <skill-name>    — <one-line description>
  2. ...

End-to-end:
  1. <app-name>      — input: <format>, output: <format>

Confirm this list, or tell me which to add, remove, or rename before I write the plans.
```

**Ask if not determinable:**
- Application name and end-to-end I/O format
- Whether LangSmith is already set up (project name, API key secret name)
- Whether there is an existing Azure ML workspace (name, resource group, subscription ID)
- Whether MLflow is already connected to the workspace, or needs to be set up

Wait for confirmation before proceeding.

## Step 3: Create the directory structure

```bash
mkdir -p docs/evaluation_plans/agents docs/evaluation_plans/skills docs/evaluation_plans/end-to-end docs/evaluation_plans/deployment
```

## Step 4: Write the model configuration YAML

Write `docs/evaluation_plans/model-config.yaml` as the single source of truth for all AI models used in the application. This file is loaded by every evaluation pipeline so models can be swapped without touching pipeline code.

### Format

```yaml
# Model configuration for evaluation pipelines.
# Override any model by editing this file and re-running the pipeline.

defaults:
  temperature: 0.0        # Deterministic output for reproducible evals
  max_tokens: 4096

agents:
  <agent-name>:
    provider: azure_openai   # azure_openai | openai | anthropic
    deployment: gpt-4o       # Azure deployment name or model ID
    api_version: "2024-05-01-preview"
    temperature: 0.0
    max_tokens: 4096

skills:
  <skill-name>:
    provider: azure_openai
    deployment: gpt-4o-mini
    api_version: "2024-05-01-preview"
    temperature: 0.0
    max_tokens: 2048

evaluator:
  provider: azure_openai
  deployment: gpt-4o         # Model used for LLM-as-judge evaluation steps
  api_version: "2024-05-01-preview"
  temperature: 0.0
  max_tokens: 1024
```

Populate the YAML with every agent and skill discovered in Step 1, using the actual model names you found. If a model was not determinable, use `gpt-4o` on Azure as the default and note it as an assumption.

## Step 5: Write the overview file

Write `docs/evaluation_plans/overview.md`.

### Content

**1. Purpose** — What the application does and why evaluating it matters.

**2. Evaluation strategy** — How evals are structured: unit evals per agent/skill, integration eval end-to-end, and regression runs on every merge.

**3. Platform** — LangSmith for experiment tracking, dataset management, and online monitoring. Azure ML for scheduled batch eval runs and MLflow for trace ingestion and score dashboards.

**4. Evaluation targets** — A table listing every agent, skill, and end-to-end flow with a one-line description and a link to its plan file.

**5. Dataset management** — Where test datasets live (`docs/evaluation_plans/*/test-dataset.md`), how they are uploaded to LangSmith and to Azure ML datasets, and how to add new cases.

**6. Model configuration** — Point to `model-config.yaml`. Note that swapping models requires editing only this file.

**7. Deployment summary** — One paragraph: scheduled batch runs run in Azure ML; results are logged to MLflow in the Azure ML workspace; dashboards are in Azure ML Studio.

Keep this file under 500 words so it is readable in under 3 minutes.

## Step 6: Write per-agent evaluation plan files

For each agent `<agent-name>`, write `docs/evaluation_plans/agents/<agent-name>/eval-plan.md`.

### Content structure

**1. Agent description** — What this agent does, its tools, and its I/O schema.

**2. Evaluation goals** — What properties are being tested (e.g., tool selection accuracy, answer correctness, hallucination rate, latency).

**3. Metrics** — A table:

| Metric | Type | Description | Passing threshold |
|--------|------|-------------|-------------------|
| Answer correctness | LLM-as-judge | GPT-4o grades the answer 1–5 | ≥ 4.0 average |
| Tool call accuracy | Exact match | Expected tool calls vs. actual | ≥ 90% |
| Latency (p50) | Numeric | Median wall-clock time | ≤ 5 s |

**4. LangSmith setup** — Dataset name in LangSmith, evaluator functions to register, and how to run:

```bash
langsmith eval run \
  --dataset "<agent-name>-eval" \
  --evaluators correctness tool_accuracy \
  --model-config docs/evaluation_plans/model-config.yaml
```

**5. LangSmith tracing** — Wrap the agent with `@traceable` or `LangSmith.wrapOpenAI`. Note the project name and tags.

**6. Test dataset reference** — Link to `test-dataset.md` in the same folder.

**7. Known failure modes** — List 2–3 common failure patterns to watch for (based on the agent's task).

### Also write `docs/evaluation_plans/agents/<agent-name>/test-dataset.md`

**Test dataset format** — Define the schema for each evaluation case:

```markdown
## Schema

| Field | Type | Description |
|-------|------|-------------|
| input | object | Agent input (matches the agent's input schema) |
| expected_output | object | Reference output for correctness scoring |
| expected_tools | list[str] | Expected tool call sequence (if applicable) |
| tags | list[str] | Labels: "happy-path", "edge-case", "regression" |

## Cases

Include at least 10 cases covering:
- 5 happy-path scenarios (typical inputs with clear correct answers)
- 3 edge cases (boundary conditions, unusual inputs, empty inputs)
- 2 regression cases (known past failures, once fixed)

## Sample cases

Show 2–3 example cases in JSON:

\`\`\`json
[
  {
    "input": { ... },
    "expected_output": { ... },
    "expected_tools": ["tool_name"],
    "tags": ["happy-path"]
  }
]
\`\`\`

## LangSmith upload

\`\`\`bash
python scripts/upload_dataset.py \
  --dataset-file docs/evaluation_plans/agents/<agent-name>/cases.jsonl \
  --langsmith-dataset "<agent-name>-eval"
\`\`\`
```

## Step 7: Write per-skill evaluation plan files

For each skill `<skill-name>`, write `docs/evaluation_plans/skills/<skill-name>/eval-plan.md` and `test-dataset.md` using the same structure as Step 6, adapted for skills:

- **Metrics** focus on output quality (format compliance, instruction following, helpfulness score) rather than tool call accuracy.
- **Evaluation type** is typically LLM-as-judge for open-ended output, or exact-match / regex for structured output.
- The test dataset emphasizes instruction-following edge cases: ambiguous inputs, conflicting constraints, and locale/language variation.

## Step 8: Write the end-to-end evaluation plan

Write `docs/evaluation_plans/end-to-end/eval-plan.md` and `test-dataset.md`.

### end-to-end/eval-plan.md content

**1. Application overview** — Top-level description of the application, its entry points, and the user journey being evaluated.

**2. Evaluation goals** — End-to-end correctness, latency budget, and regression catch rate.

**3. Metrics**

| Metric | Type | Passing threshold |
|--------|------|-------------------|
| End-to-end correctness | LLM-as-judge | ≥ 4.0 / 5 |
| Latency (p95) | Numeric | ≤ 30 s |
| Error rate | Numeric | ≤ 2% |

**4. LangSmith dataset** — Name and run command.

**5. Integration with unit evals** — How end-to-end failures are triaged back to the agent/skill responsible.

**6. Trace visualization** — LangSmith trace URL pattern; MLflow dashboard URL in Azure ML Studio.

### end-to-end/test-dataset.md content

Same schema as agent datasets but at the application input/output level. Include at least:
- 10 happy-path cases representative of real user requests
- 5 edge cases (empty input, oversized input, adversarial prompt)
- 5 regression cases (one per known past incident, if any)

## Step 9: Write the deployment plan

Write three files in `docs/evaluation_plans/deployment/`.

### deployment/azure-ml-overview.md

**1. Architecture** — ASCII diagram:

```
LangSmith (experiment tracking)
        │
        ▼
Azure ML Pipeline Job ──► Azure ML Compute Cluster
        │
        ▼
MLflow Tracking (Azure ML workspace)
        │
        ▼
Azure ML Studio Dashboard
```

**2. Resources required**
- Azure ML Workspace (name, resource group, subscription)
- Compute cluster (SKU: `Standard_DS3_v2`, min 0 nodes, max 4 nodes)
- Azure Blob Storage container for datasets and pipeline artifacts
- MLflow experiment: `<app-name>-eval`
- LangSmith project: `<app-name>-eval`

**3. Secrets and environment variables**

| Secret | Source | Used by |
|--------|--------|---------|
| `LANGSMITH_API_KEY` | Azure Key Vault | All pipeline steps |
| `AZURE_OPENAI_API_KEY` | Azure Key Vault | Agent/skill steps |
| `AZURE_OPENAI_ENDPOINT` | Azure Key Vault | Agent/skill steps |

**4. Scheduling** — Nightly batch run on a cron schedule: `0 2 * * *` (UTC).

### deployment/azure-ml-pipeline.md

**1. Pipeline structure** — One Azure ML Pipeline with these steps in order:

```
Step 1: load-dataset      — Download dataset from Azure Blob or LangSmith
Step 2: run-evaluations   — Execute eval scripts for each agent/skill
Step 3: log-results       — Upload scores to MLflow via mlflow.log_metrics()
Step 4: report            — Generate a summary Markdown and upload as artifact
```

**2. Environment definition** — Conda/pip environment YAML for the pipeline container.

**3. Running manually:**

```bash
az ml job create \
  --file azure_ml/eval_pipeline.yaml \
  --workspace-name <workspace> \
  --resource-group <rg> \
  --subscription <sub-id>
```

**4. Viewing results** — Navigate to Azure ML Studio → Experiments → `<app-name>-eval` → select the run → Metrics tab. MLflow traces are visible in the Tracing tab.

### deployment/azure-ml-utilities.md

Document four utility scripts that must be implemented (paths under `scripts/`):

**`scripts/upload_dataset.py`**
- Reads a `.jsonl` file from `docs/evaluation_plans/*/cases.jsonl`
- Uploads it as a LangSmith dataset (via `langsmith.Client().create_dataset`)
- Also uploads it as an Azure ML Data Asset (via `azure.ai.ml.MLClient`)

```python
# Usage
python scripts/upload_dataset.py \
  --dataset-file docs/evaluation_plans/agents/<agent>/cases.jsonl \
  --langsmith-dataset "<agent>-eval" \
  --azureml-dataset "<agent>-eval" \
  --workspace-name <ws> \
  --resource-group <rg>
```

**`scripts/register_pipeline.py`**
- Loads `azure_ml/eval_pipeline.yaml`
- Registers the pipeline component in the Azure ML workspace

```python
# Usage
python scripts/register_pipeline.py \
  --pipeline-file azure_ml/eval_pipeline.yaml \
  --workspace-name <ws> \
  --resource-group <rg>
```

**`scripts/run_eval.py`**
- Runs evaluations locally (no Azure ML) for fast iteration during development
- Loads model config from `docs/evaluation_plans/model-config.yaml`
- Logs results to LangSmith

```python
# Usage
python scripts/run_eval.py \
  --target agents/<agent-name> \
  --model-config docs/evaluation_plans/model-config.yaml
```

**`scripts/sync_mlflow.py`**
- Fetches evaluation results from LangSmith
- Logs them to MLflow in the Azure ML workspace so they appear in Azure ML Studio

```python
# Usage
python scripts/sync_mlflow.py \
  --langsmith-project <app-name>-eval \
  --mlflow-experiment <app-name>-eval
```

For each script, document: required environment variables, input parameters, expected output, and error handling notes.

## Step 10: Update the README index

Write or update `docs/evaluation_plans/README.md` as the entry point for all evaluation plans.

```markdown
---
title: "Evaluation Plans"
version: 1.0.0
date: YYYY-MM-DD
authors:
  - <author>
changelog:
  - version: 1.0.0
    date: YYYY-MM-DD
    author: <author>
    changes: Initial version
---

# Evaluation Plans

| Document | Description |
|----------|-------------|
| [Overview](overview.md) | Evaluation strategy, platform, and target summary |
| [Model Config](model-config.yaml) | AI model configuration for all pipelines |
| **Agents** | |
| [<agent> — Eval Plan](agents/<agent>/eval-plan.md) | ... |
| [<agent> — Test Dataset](agents/<agent>/test-dataset.md) | ... |
| **Skills** | |
| [<skill> — Eval Plan](skills/<skill>/eval-plan.md) | ... |
| [<skill> — Test Dataset](skills/<skill>/test-dataset.md) | ... |
| **End-to-End** | |
| [End-to-End — Eval Plan](end-to-end/eval-plan.md) | ... |
| [End-to-End — Test Dataset](end-to-end/test-dataset.md) | ... |
| **Deployment** | |
| [Azure ML — Overview](deployment/azure-ml-overview.md) | Resources, secrets, and scheduling |
| [Azure ML — Pipeline](deployment/azure-ml-pipeline.md) | Pipeline steps and how to run |
| [Azure ML — Utilities](deployment/azure-ml-utilities.md) | Utility scripts reference |
```

## Frontmatter format

Every plan file must begin with YAML frontmatter:

```markdown
---
title: "Evaluation Plan — <Component>"
version: 1.0.0
date: YYYY-MM-DD
authors:
  - <author>
changelog:
  - version: 1.0.0
    date: YYYY-MM-DD
    author: <author>
    changes: Initial version
---
```

When **updating** an existing file, increment the version (patch `x.x.1` for edits, minor `x.1.0` for new sections, major `2.0.0` for rewrites), set today's date, and append a changelog entry.

## Readability constraint

Each markdown file must be readable in under 3 minutes (~400–600 words / ~50 lines of content). If a file grows beyond this, split it: move detailed metric definitions to a `-metrics.md` companion, or move the full dataset schema to a `-schema.md` companion.

## Step 11: Confirm with the user

List every file created or updated — filename, version, and a one-sentence summary of what it covers. Call out any assumptions (model names inferred, agent list inferred, Azure workspace name used) so the user can correct them.
