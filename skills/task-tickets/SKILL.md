---
name: task-tickets
description: |
  Generate and register task tickets from implementation plans to a kanban tool. Always use this skill when the user wants to: create tickets from a plan, register tasks to GitHub Projects or Issues, add work items to Notion, create Linear issues from a plan, turn implementation plans into tickets, or populate a kanban board from impl-plan or devops-plan documents. Trigger on: create tickets, register tasks, kanban tickets, GitHub project tickets, Notion tasks, Linear issues, task board, work items, ticket generation. When the user has implementation plans and says "create tickets", "register to GitHub Projects", "add to Notion", or "make tickets from this plan" — that's this skill.
---

# Task Ticket Generator

You help turn implementation plan documents (`impl-plan` and `devops-plan`) into task tickets registered directly in a kanban tool. Tickets must contain enough context for an AI coding agent to implement the task and open a pull request without needing to ask follow-up questions.

## Step 1: Identify the target tool and verify CLI availability

Ask the user which kanban tool to register tickets to if they haven't specified. Supported tools:

| Tool | CLI / Access method | Check command |
|------|---------------------|---------------|
| GitHub Issues + Projects | `gh` (GitHub CLI) | `gh --version` |
| Linear | Linear MCP or `linear` CLI | `linear --version` |
| Notion | Notion MCP | verify MCP is active |
| Jira | `jira` (go-jira or Atlassian CLI) | `jira --version` |

Run the check command for the selected tool. If the CLI is not found and no MCP server is configured for it, **stop here** and notify the user with installation guidance:

> The `<tool>` CLI is not available. Please install it first:
> - GitHub CLI: https://cli.github.com
> - go-jira CLI: https://github.com/go-jira/jira

Do not proceed until the CLI or MCP is confirmed available.

Also collect at this step:
- **GitHub**: project number (run `gh project list` to show options) and repo owner/name
- **Linear**: team key and project name
- **Notion**: database ID and the property names for title, description, and labels
- **Jira**: project key

## Step 2: Gather plan files

Ask the user which plans to convert into tickets if not already specified. Plans come from two sources:

- **impl-plan documents**: `docs/plans/*.md` — architecture, data model, API, components, infrastructure, and task files
- **devops-plan documents**: `.github/workflows/*.md` — pipeline plan files

Read the specified files. Start with the `-tasks.md` file from impl-plan (which already enumerates discrete tasks), then open the supporting files (architecture, data-model, api, components, infra) to extract the technical context needed to enrich each ticket. For devops-plan, treat each pipeline markdown file as a source of one or more implementation tickets.

If no plan files exist, stop and prompt the user to run the `impl-plan` or `devops-plan` skill first.

## Step 3: Extract and enrich tasks

For each task derived from the plans, build a complete ticket.

### Ticket fields

**Title** — Action-oriented and specific. Name the thing being built.

> Example: `Create users table migration (id, email, created_at, updated_at)`

**Description** — Must include all of the following sections:

**1. Context**
Which feature or initiative this belongs to, and a markdown link to the source plan file. Always include this link — it is the primary reference for the implementor.

Format: `Source: [<plan-file-name>](<relative-path-to-plan-file>)`

Example: `Source: [user-auth-architecture.md](docs/plans/user-auth-architecture.md)`

If a ticket draws from multiple plan files (e.g., both an impl-plan and a devops-plan file), list all source links.

**2. Objective**
One sentence stating what "done" looks like.

**3. Technical guidance**
Pull the relevant specifics from the plan: exact technology names, schema definitions, API request/response shapes, architecture constraints, and dependencies on other tasks. A developer or AI coding agent reading only this ticket must know what to build without opening the plan.

**4. Acceptance criteria**
Bulleted list of observable conditions that must be true for the task to be considered complete.

**5. Testing requirements**
Always include testing tasks — never omit them:
- **Unit tests**: what functions/classes to test, which dependencies to mock, and the key edge cases to cover.
- **Integration tests**: what end-to-end or cross-component behavior to verify, what test infrastructure is required (test database, external mock server, seeded data, etc.), and which other components the integration relies on.

**6. PR instructions**
- Target branch (e.g., `main`, `develop`)
- Suggested PR title format
- Checklist items the PR description should include (e.g., "Links to this issue", "Tests added", "Migration reversible")

### Task sizing

Each ticket should be completable by one developer or AI agent in a single sitting. If a plan task is too broad (spans multiple layers or days of work), split it into subtasks. If multiple plan tasks are trivially small and tightly coupled, merge them into one ticket.

### Ordering and dependencies

Note prerequisite tickets in the description (e.g., "Depends on: Create users table migration"). When the tool supports linking issues, link them after creation.

## Step 4: Apply labels

Add labels to every ticket:

| Label | Purpose |
|-------|---------|
| `ai-agent` | Marks that this ticket was generated by an AI coding agent |
| Component/feature label | Derived from the plan file prefix (e.g., `auth`, `payments`, `iac`, `ci-cd`) |

**GitHub**: create missing labels with `gh label create "<name>" --color "<hex>"` before creating issues.
**Linear**: use the team's label list; create new ones if needed.
**Notion**: set the tags/select property on each row.
**Jira**: use the `--label` flag; Jira creates labels automatically.

## Step 5: Register tickets

Create tickets in dependency order — prerequisites first, dependents after. Use the appropriate commands:

### GitHub Issues + Projects

```bash
# Create the issue
gh issue create \
  --title "<title>" \
  --body "<description>" \
  --label "ai-agent,<component>"

# Add the issue to a project board
gh project item-add <project-number> --owner <owner> --url <issue-url>
```

Set the project status to the backlog or intake column after adding.

### Linear

Use the Linear MCP or CLI to create issues in the specified team and project. Set the status to the backlog state. Populate estimate if the team uses story points.

### Notion

Use the Notion MCP to create database rows. Map the ticket fields to the database schema using the property names gathered in Step 1.

### Jira

```bash
jira issue create \
  --project <PROJECT_KEY> \
  --summary "<title>" \
  --description "<description>" \
  --label "ai-agent" \
  --label "<component>"
```

## Step 6: Confirm with the user

Report:
- How many tickets were created and in which tool/project
- A summary list of ticket titles with their IDs or URLs (one line each)
- Any assumptions made — task splits or merges, label names created, target branch, test infrastructure assumed
- Any tickets that could not be created and the reason

Prompt the user to review ticket ordering and assignments in the kanban tool before work begins.
