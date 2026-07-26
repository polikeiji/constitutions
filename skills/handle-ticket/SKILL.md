---
name: handle-ticket
description: |
  Handle a GitHub project ticket end-to-end: implement it with per-sub-item commits and live status tracking, open a PR, self-review that PR using the official code-review skill, post the findings as inline PR comments, fix every finding, and reply to each review comment explaining how it was handled. Always use this skill when the user wants to: implement a GitHub ticket, work on a GitHub issue, execute a task from a project board, complete a GitHub project item, take a ticket through to a reviewed PR, or handle/close out a ticket end to end. Trigger on: implement ticket, work on issue, execute ticket, handle ticket, do the ticket, take this ticket to a PR, implement and review this ticket, close out this ticket. When the user references a GitHub issue number or ticket title and says "implement this", "work on", "execute", "do this ticket", or "handle this ticket" — that's this skill.
---

# GitHub Ticket Handler

You take a GitHub project ticket from "not started" to "reviewed, revised, and ready for a human" in one pass: implement it, track its status on the project board, open a PR, review that PR yourself with the official `code-review` skill, post the findings, fix them, and reply to every comment explaining what you did about it.

**Dependency:** This skill requires the `code-review` skill from `claude-plugins-official` for Step 9. Ensure it is installed before proceeding.

The work happens in four phases — implement, open the PR, review, fix — and the ticket's project-board status changes exactly twice: to **In Progress** the moment work starts (Step 4), and to **In Review** the moment the PR exists (Step 8). Nothing later in the flow (self-review, fixes, replies) moves the status again — those are still pre-human-review activity on the same PR, and a human still needs to look at it.

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

Before touching any code, move the parent ticket to In Progress so the board reflects active work the moment you start:

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

Do **not** add the PR to the project board yourself. Whether PRs belong on the board is a per-project convention set by that project's own "Auto-add to project" / "Pull request linked to issue" workflows (`gh api graphql -f query='{ user(login: "<owner>") { projectV2(number: <n>) { workflows(first: 20) { nodes { name enabled } } } } }'`) — if those are enabled, the PR will appear on its own; if they're disabled, the project has deliberately chosen to track issues only, and manually inserting the PR via `addProjectV2ItemById` will silently violate that convention.

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

The ticket now reflects reality — the implementation is done and a PR is up. Everything from here on (self-review, fixes, replies) happens on that same open PR; it does not move the ticket further.

## Step 9: Review the PR yourself

Now switch hats from implementer to reviewer. Review the PR you just opened using the official `code-review` skill, and post the findings as an inline GitHub review — the same as an independent reviewer would, so the fixes in Step 10 are driven by an honest pass over the diff rather than by memory of writing it.

### 9a. Fetch PR metadata and diff

```bash
# Resolve owner/repo for the current repository
gh repo view --json owner,name

# Fetch PR metadata
gh pr view <pr-number> --json title,body,headRefName,baseRefName,files,commits,author

# Fetch the full unified diff
gh pr diff <pr-number>
```

### 9b. Run the code-review skill

Invoke the Skill tool with `skill: "code-review:code-review"` — the plugin-qualified name, from `claude-plugins-official`. The bare name `code-review` resolves to nothing and fails with a misleading `Skill code-review cannot be used with Skill tool due to disable-model-invocation` error, even though the plugin itself has `disable-model-invocation: false`. Pass the full unified diff and the PR description as context. The code-review skill handles the analysis itself — do not duplicate its logic here.

If the qualified-name call still fails, do not retry it — fall back to a manual review (optionally via a fresh subagent for an independent read of the diff) and post findings the same way Step 9d would.

Each finding should have:
- **Severity** — bug, security issue, code refinement, style, or nitpick
- **File path** and **line number** (or line range) in the new version of the file
- **Description** — what the issue is and why it matters
- **Suggested fix** — for bugs and code refinements where you have a clear idea of the correct code

If the code-review skill returns findings without file/line metadata, map each finding to a location by cross-referencing the unified diff from 9a.

### 9c. Run tests from the PR description

Inspect the PR body from 9a for a test plan or test checklist:

1. **Identify tests** — look for a "Test plan", "Testing", or similar section with a checklist (`- [ ]` / `- [x]` lines).
2. **Run each test** — execute the described steps to verify the changes behave as expected.
3. **Check off completed tests** one at a time as each one passes:

```bash
gh pr view <pr-number> --json body -q .body
# then, after completing a test, update the body with that checkbox checked
gh pr edit <pr-number> --body "<updated-body-with-checked-boxes>"
```

If a test fails or cannot be run, leave its checkbox unchecked and note the failure in the review summary. If the PR description has no test plan, skip this step.

### 9d. Classify findings

Sort findings into two groups:

- **With a suggestion** — bugs or refinements where you know exactly what the corrected code should look like. These become GitHub code suggestions.
- **Without a suggestion** — observations, questions, style notes, or issues where the right fix depends on a decision the author must make. These become plain review comments.

Discard nitpicks that don't warrant a comment at all (minor whitespace, subjective naming with no clear winner).

### 9e. Post the review

Build one inline comment per surviving finding — `path`, `line` (or `start_line`+`line` for multi-line), `side` (`"RIGHT"` for new-file lines, `"LEFT"` for deleted ones), and `body`:

```
**[Severity]** Short description of the issue.

Explanation of why this matters or what could go wrong.
```

For findings with a clear fix, embed a fenced suggestion block containing **only the replacement lines**:

```
**[Bug / Refinement]** Short description of the issue.

Brief explanation, then the suggested replacement:

~~~suggestion
exact replacement lines for the highlighted range
~~~
```

Write a 2–5 sentence review summary (what the PR does, the most significant findings, an overall verdict) and choose the event: `REQUEST_CHANGES` if any bugs/security issues, `COMMENT` if only refinements/style/questions, `APPROVE` if nothing needs changing.

Post everything as a **single** API call — do not post individual comments separately, and do not post findings as ordinary (non-review) PR comments:

```bash
gh api repos/{owner}/{repo}/pulls/<pr-number>/reviews \
  --method POST \
  -f body="<review summary>" \
  -f event="<REQUEST_CHANGES|COMMENT|APPROVE>" \
  -F comments='[
    {"path": "<file-path>", "line": <line-number>, "side": "RIGHT", "body": "<comment body>"},
    {"path": "<file-path>", "start_line": <start>, "line": <end>, "side": "RIGHT", "body": "<comment with suggestion block>"}
  ]'
```

If the call fails with a position error (line not in the diff), re-check the unified diff and adjust to the nearest changed line within the same hunk.

**Record the review's `id`** from the response — you need it next to look up each individual comment's ID:

```bash
review_id="<id from the response above>"
gh api repos/{owner}/{repo}/pulls/<pr-number>/comments --paginate | \
  jq --argjson rid "$review_id" '[.[] | select(.pull_request_review_id == $rid) | {id, path, line, body}]'
```

Keep this list — Steps 10 and 11 iterate over it by comment `id`. If the review event was `APPROVE` (no findings posted), skip Steps 10 and 11 and go straight to Step 12.

## Step 10: Fix the findings

Work through the comment list from 9e one finding at a time:

- **Actionable findings** (bugs, security issues, refinements you posted with or without a suggestion block) — make the code change on the same branch. Prefer a commit per logical fix, or group tightly related fixes, referencing what it addresses:

```bash
git add <specific files>
git commit -m "$(cat <<'EOF'
<Concise description of the fix>

Addresses review comment on <path>:<line>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- **Non-actionable findings** (questions, nitpicks you intentionally left as comments, or anything where the right call depends on a decision only the ticket owner should make) — leave the code as-is. You'll explain why in Step 11; don't skip a code change just to avoid writing that explanation.

After working through every finding, push the fixes:

```bash
git push
```

## Step 11: Reply to every review comment

For **each** comment recorded in 9e — including ones you didn't act on — post a reply on its thread explaining what happened to it. Do not leave any comment without a reply.

```bash
gh api repos/{owner}/{repo}/pulls/<pr-number>/comments/<comment-id>/replies \
  --method POST \
  -f body="<reply text>"
```

Reply text conventions:
- **Fixed:** `Fixed in <short-sha>: <one-line description of the change>.`
- **Not changed:** `Not changing this: <reason — e.g. it's a style preference with no clear winner, or the fix depends on a decision the ticket owner should make>.`

## Step 12: Confirm with the user

Report, in one place:
- The branch created and the PR URL
- Sub-items implemented, each with its commit hash; any skipped and why
- Any status transitions that could not be completed and why
- The self-review verdict and how many findings were posted (suggestions vs. plain comments)
- How many findings were fixed vs. left as-is, with the reasoning for anything left unfixed
- Confirmation that every review comment received a reply

Prompt the user to give the PR a human review — this skill's self-review and fixes are a first pass, not a substitute for one.

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-07-21 | Initial version. Merges `implement-ticket` (through its 1.4.0 — including deferring PR-to-board addition to the project's own auto-add workflows instead of forcing it via `addProjectV2ItemById`) and `review-pr` into a single end-to-end flow, adding self-review fix-up (Step 10) and per-comment replies (Step 11). |
