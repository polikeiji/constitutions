---
name: implement-ticket
description: |
  Implement a GitHub project ticket with per-sub-item commits, live status tracking, and automatic PR creation. Always use this skill when the user wants to: implement a GitHub ticket, work on a GitHub issue, execute a task from a project board, or complete a GitHub project item. Trigger on: implement ticket, work on issue, execute ticket, implement issue, start ticket, do the ticket. When the user references a GitHub issue number or ticket title and says "implement this", "work on", "execute", or "do this ticket" — that's this skill.
---

# GitHub Ticket Implementor

You help implement GitHub project tickets end-to-end: reading the ticket, tracking sub-item progress in the project board, committing per sub-item, and opening a PR linked to the parent ticket when all work is done.

## Step 1: Read the parent ticket

Identify the target ticket from the user's prompt (issue number or URL). Fetch its full details:

```bash
gh issue view <issue-number> --json title,body,projectItems,labels,assignees
```

From the body, extract:
- **Objective** — what "done" looks like
- **Technical guidance** — implementation constraints, technology choices, schema details
- **Acceptance criteria** — the checklist that defines completeness
- **Sub-items** — child issues or task-list checkboxes that break the ticket into discrete steps

### Identifying sub-items

Sub-items may appear as either:

**a. Child issues** (GitHub sub-issues feature):
```bash
gh issue list --search "is:issue" # or use the API
gh api graphql -f query='{ repository(owner:"<owner>", name:"<repo>") { issue(number:<n>) { subIssues(first:20) { nodes { number title state } } } } }'
```

**b. Task-list checkboxes** in the issue body — parse the markdown for `- [ ]` and `- [x]` lines. If checkboxes reference issue numbers (e.g., `- [ ] #42 — Create users table`), treat those as linked child issues.

If the issue has no sub-items, treat the entire ticket as a single unit of work and skip the per-sub-item status tracking steps.

## Step 2: Identify the GitHub Project and its status field

Look up the project items for this issue to get the project ID and status field metadata needed for status updates:

```bash
# Find which project(s) this issue belongs to
gh issue view <issue-number> --json projectItems

# List project fields to find the Status field ID and its option IDs
gh project field-list <project-number> --owner <owner> --format json
```

Record:
- `project-id` — the GraphQL node ID of the project
- `status-field-id` — the node ID of the Status field
- Option IDs for: **In Progress**, **Done**, **In Review** (exact names may vary per project — match case-insensitively)

```bash
# Get the item ID for this issue within the project
gh project item-list <project-number> --owner <owner> --format json | \
  jq '.items[] | select(.content.number == <issue-number>)'
```

## Step 3: Create a feature branch

Branch off `main` (or the target branch stated in the ticket). Use the issue number and a short slug of the title:

```bash
git checkout main && git pull
git checkout -b <issue-number>-<short-kebab-slug>
# Example: 42-create-users-table
```

One branch per parent ticket. Do not open more than one PR for the same parent ticket.

## Step 4: Mark the parent ticket "In Progress"

Before touching any code, move the parent ticket to In Progress so the board reflects active work:

```bash
gh project item-edit \
  --id <parent-project-item-id> \
  --project-id <project-id> \
  --field-id <status-field-id> \
  --single-select-option-id <in-progress-option-id>
```

## Step 5: Implement each sub-item

Work through sub-items in dependency order (prerequisites first). For each sub-item:

### 5a. Mark sub-item "In Progress"

If the sub-item is a linked child issue, update its project status:

```bash
gh project item-edit \
  --id <sub-item-project-item-id> \
  --project-id <project-id> \
  --field-id <status-field-id> \
  --single-select-option-id <in-progress-option-id>
```

If the sub-item is a task-list checkbox (not a separate issue), note it in the commit message instead — you cannot update project status for inline checkboxes.

### 5b. Implement the sub-item

Write the code or make the changes required by this sub-item. Stay focused on what the sub-item describes — do not mix in work from other sub-items.

### 5c. Commit the changes

Stage the relevant files and commit. The commit message must reference the sub-item issue number so GitHub auto-links the commit:

```bash
git add <specific files>
git commit -m "$(cat <<'EOF'
<Concise description of what this commit does>

Refs #<sub-item-issue-number>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

Use `Refs` (not `Closes`) to link without closing the sub-item — the issue stays open until the PR is merged.

If the sub-item was a task-list checkbox (no separate issue number), omit the `Refs` line.

### 5d. Mark sub-item "Done"

After committing, update the sub-item's project status to Done:

```bash
gh project item-edit \
  --id <sub-item-project-item-id> \
  --project-id <project-id> \
  --field-id <status-field-id> \
  --single-select-option-id <done-option-id>
```

Repeat Steps 5a–5d for every sub-item before moving on.

## Step 6: Push the branch

```bash
git push -u origin <branch-name>
```

## Step 7: Open a PR and link it to the parent ticket

Create a single PR that covers all the sub-item work. The PR body must reference the parent issue with a closing keyword so it auto-closes on merge:

```bash
gh pr create \
  --title "<Parent ticket title>" \
  --body "$(cat <<'EOF'
## Summary
<1-3 bullet points describing what was implemented>

## Test plan
- [ ] <Key thing to verify>
- [ ] Acceptance criteria from #<issue-number> are all met

Closes #<parent-issue-number>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

If the project board shows the PR as a separate item, add it:

```bash
gh project item-add <project-number> --owner <owner> --url <pr-url>
```

## Step 8: Move the parent ticket to "In Review"

Update the parent issue's project status:

```bash
gh project item-edit \
  --id <parent-project-item-id> \
  --project-id <project-id> \
  --field-id <status-field-id> \
  --single-select-option-id <in-review-option-id>
```

## Step 9: Confirm with the user

Report:
- The branch created and the PR URL
- A list of sub-items implemented, each with its commit hash
- Any sub-items skipped and the reason (e.g., already done, blocked by external dependency)
- Any status transitions that could not be completed and why (missing field IDs, insufficient permissions, etc.)

Prompt the user to review the PR and assign reviewers.
