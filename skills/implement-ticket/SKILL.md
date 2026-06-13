---
name: implement-ticket
version: 1.3.0
description: |
  Implement a GitHub project ticket with per-sub-item commits, live status tracking, and automatic PR creation. Always use this skill when the user wants to: implement a GitHub ticket, work on a GitHub issue, execute a task from a project board, or complete a GitHub project item. Trigger on: implement ticket, work on issue, execute ticket, implement issue, start ticket, do the ticket. When the user references a GitHub issue number or ticket title and says "implement this", "work on", "execute", or "do this ticket" — that's this skill.
changelog:
  - version: 1.3.0
    date: 2026-06-13
    changes: "Fix sub-item status updates: (1) replace <placeholder> tokens with shell variables in item-edit commands so edits actually execute; (2) add explicit sub-item completion sweep in new Step 7b that marks every sub-item Done before moving the parent to In Review; (3) restructure Step 2 to produce a named shell variable per sub-item for use in later steps."
  - version: 1.2.0
    date: 2026-06-13
    changes: "Add sub-item board enrollment: if a linked child issue is not already on the project board, add it via GraphQL mutation before updating its status. Replace unreliable `gh project item-add` CLI with the `addProjectV2ItemById` GraphQL mutation throughout. Clarify Step 2 to enumerate sub-item item IDs and flag missing ones."
  - version: 1.1.0
    date: 2026-06-05
    changes: Add Step 0 pre-flight auth check for `project` OAuth scope; block execution if scope is missing rather than silently skipping status updates.
  - version: 1.0.0
    date: 2026-06-05
    changes: Initial version.
---

# GitHub Ticket Implementor

You help implement GitHub project tickets end-to-end: reading the ticket, tracking sub-item progress in the project board, committing per sub-item, and opening a PR linked to the parent ticket when all work is done.

## Step 0: Verify GitHub CLI auth scopes (pre-flight)

All project board status updates (`gh project item-edit`) require the `project` OAuth scope. Check for it **before** doing any other work:

```bash
gh auth status
```

Look for `Token scopes` in the output. If `project` is **not** listed:

1. **Stop immediately.** Do not create a branch, write any code, or make any commits yet.
2. Tell the user:

   > `gh` is missing the `project` OAuth scope, which is required to update project board statuses. Please run:
   > ```
   > gh auth refresh -s project
   > ```
   > Then re-run this task so status updates work from the start.

3. **Do not proceed** until the user confirms they have run `gh auth refresh -s project` and re-invokes the task.

If `project` is listed in the scopes, continue to Step 1.

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

# Get the project GraphQL node ID
gh api graphql -f query='{ user(login: "<owner>") { projectV2(number: <project-number>) { id } } }' \
  | jq -r '.data.user.projectV2.id'

# List project fields to find the Status field ID and its option IDs
gh project field-list <project-number> --owner <owner> --format json
```

Store the results in shell variables that all later steps use:

```bash
project_id="<GraphQL node ID from above>"
status_field_id="<Status field node ID>"
in_progress_option_id="<option ID for In Progress>"
done_option_id="<option ID for Done>"
in_review_option_id="<option ID for In Review>"
```

Option names vary per project — match case-insensitively. Print them to confirm before continuing.

```bash
# Get the item ID for the parent issue within the project
parent_item_id=$(gh project item-list <project-number> --owner <owner> --format json | \
  jq -r '.items[] | select(.content.number == <issue-number>) | .id')
echo "Parent item ID: $parent_item_id"
```

### Enrolling sub-items in the project board and building the item ID map

Sub-issues that were never explicitly added to the project board will not appear in `gh project item-list`. **Do not assume a missing sub-item means it has no item ID** — it simply hasn't been enrolled yet.

For **each** linked child issue number, run the block below once and record the resulting shell variable. These variables are used by name in Steps 5a, 5d, and 7b — do **not** substitute placeholder text in those later steps; use the variable directly.

```bash
# Replace SUB_N with a short identifier for this sub-item (e.g., SUB_1, SUB_2, ...)
# and <sub-issue-number> with the actual issue number.

# Check if already on the board
existing=$(gh project item-list <project-number> --owner <owner> --format json | \
  jq -r --argjson n <sub-issue-number> '.items[] | select(.content.number == $n) | .id')

if [ -n "$existing" ]; then
  SUB_N_item_id="$existing"
else
  # Not on board yet — add it
  sub_node_id=$(gh api repos/<owner>/<repo>/issues/<sub-issue-number> --jq '.node_id')
  SUB_N_item_id=$(gh api graphql -f query="mutation {
    addProjectV2ItemById(input: {projectId: \"$project_id\", contentId: \"$sub_node_id\"}) {
      item { id }
    }
  }" | jq -r '.data.addProjectV2ItemById.item.id')
fi

echo "Sub-item <sub-issue-number> project item ID: $SUB_N_item_id"
```

After running this for every sub-item, write out a quick summary table so you can reference it later:

```
Sub-item issue | Shell variable   | Project item ID
#<n1>          | $SUB_1_item_id   | PVTI_...
#<n2>          | $SUB_2_item_id   | PVTI_...
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
  --id "$parent_item_id" \
  --project-id "$project_id" \
  --field-id "$status_field_id" \
  --single-select-option-id "$in_progress_option_id"
```

## Step 5: Implement each sub-item

Work through sub-items in dependency order (prerequisites first). For each sub-item:

### 5a. Mark sub-item "In Progress"

You already have the project item ID for this sub-item from the enrollment step in Step 2 (stored as `$SUB_N_item_id`). Use that variable directly — do **not** re-enroll or look it up again.

```bash
# Use the variable recorded in Step 2, e.g. $SUB_1_item_id, $SUB_2_item_id, etc.
gh project item-edit \
  --id "$SUB_N_item_id" \
  --project-id "$project_id" \
  --field-id "$status_field_id" \
  --single-select-option-id "$in_progress_option_id"
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

After committing, update the sub-item's project status to Done using the same variable from Step 2:

```bash
gh project item-edit \
  --id "$SUB_N_item_id" \
  --project-id "$project_id" \
  --field-id "$status_field_id" \
  --single-select-option-id "$done_option_id"
```

Verify the command exits 0. If it fails, re-check that `$SUB_N_item_id` is set and non-empty (echo it), then retry.

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

If the project board shows the PR as a separate item, add it via GraphQL (more reliable than `gh project item-add`):

```bash
pr_node_id=$(gh pr view <pr-number> --json id --jq '.id')
gh api graphql -f query="mutation {
  addProjectV2ItemById(input: {projectId: \"$project_id\", contentId: \"$pr_node_id\"}) {
    item { id }
  }
}"
```

## Step 7b: Verify and complete all sub-item statuses

**Before moving the parent to In Review, explicitly mark every sub-item Done.** Do this even if you believe you already did it in Step 5d — confirmation is cheap and failures in 5d are silent.

For each sub-item issue, run:

```bash
# Check current status
gh project item-list <project-number> --owner <owner> --format json | \
  jq --arg id "$SUB_N_item_id" '.items[] | select(.id == $id) | .status'

# If not already "Done", update it now
gh project item-edit \
  --id "$SUB_N_item_id" \
  --project-id "$project_id" \
  --field-id "$status_field_id" \
  --single-select-option-id "$done_option_id"
```

Do this for **every** sub-item variable (`$SUB_1_item_id`, `$SUB_2_item_id`, etc.) before continuing. If any `item-edit` call fails, investigate immediately — do not skip it and proceed.

## Step 8: Move the parent ticket to "In Review"

All sub-items must be Done (verified in Step 7b) before running this. Update the parent issue's project status:

```bash
gh project item-edit \
  --id "$parent_item_id" \
  --project-id "$project_id" \
  --field-id "$status_field_id" \
  --single-select-option-id "$in_review_option_id"
```

## Step 9: Confirm with the user

Report:
- The branch created and the PR URL
- A list of sub-items implemented, each with its commit hash
- Any sub-items skipped and the reason (e.g., already done, blocked by external dependency)
- Any status transitions that could not be completed and why (missing field IDs, insufficient permissions, etc.)

Prompt the user to review the PR and assign reviewers.
