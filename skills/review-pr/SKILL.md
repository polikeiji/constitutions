---
name: review-pr
description: |
  Review a GitHub pull request and post findings as inline PR review comments with code suggestions. Always use this skill when the user wants to: review a GitHub PR, review a pull request, check a PR for issues, give feedback on a PR, or post code review comments to GitHub. Trigger on: review PR, review pull request, review this PR, check this PR, post review comments, code review GitHub PR. When the user provides a PR number or URL and says "review this", "review the PR", or "give feedback on this PR" — that's this skill.
---

# GitHub PR Reviewer

You review GitHub pull requests using the official `code-review` skill and post all findings as inline GitHub PR review comments. Suggestions with clear fixes use GitHub's code suggestion format so the author can apply them with one click.

**Dependency:** This skill requires the `code-review` skill from `claude-plugins-official`. Ensure it is installed before proceeding.

## Step 1: Fetch PR metadata and diff

Identify the target PR from the user's prompt (number or URL). Fetch its details and the unified diff:

```bash
# Resolve owner/repo for the current repository
gh repo view --json owner,name

# Fetch PR metadata
gh pr view <pr-number> --json title,body,headRefName,baseRefName,files,commits,author

# Fetch the full unified diff
gh pr diff <pr-number>
```

From the metadata note:
- **Base branch** and **head branch** — needed for the review scope
- **Changed files** — the list of paths touched by this PR
- **PR description** — the stated intent, which the review should validate against

## Step 2: Run the code-review skill

Invoke the `code-review` skill from `claude-plugins-official` on the PR diff. Pass the full unified diff and the PR description as context. The code-review skill handles the analysis itself — do not duplicate its logic here.

The code-review skill will produce a set of findings. Each finding should have:
- **Severity** — bug, security issue, code refinement, style, or nitpick
- **File path** and **line number** (or line range) in the new version of the file
- **Description** — what the issue is and why it matters
- **Suggested fix** — for bugs and code refinements where you have a clear idea of the correct code

If the code-review skill returns findings without file/line metadata, map each finding to a location by cross-referencing the unified diff output from Step 1.

## Step 3: Classify findings

Before posting, sort findings into two groups:

**Inline comments with suggestions** — bugs or code refinements where you know exactly what the corrected code should look like. These become GitHub code suggestions the author can apply directly.

**Inline comments without suggestions** — observations, questions, style notes, or issues where the right fix depends on context the author must decide. These become plain review comments.

Discard nitpicks that do not warrant a comment (e.g., minor whitespace, subjective naming preferences with no clear winner).

## Step 4: Build the review payload

Construct a list of inline review comments. For each finding, identify:

- `path` — the file path relative to the repo root (e.g., `src/auth/login.ts`)
- `line` — the last line of the relevant hunk in the **new** file (use `start_line` + `line` for multi-line comments)
- `side` — `"RIGHT"` for new-file lines (almost always); `"LEFT"` for deleted lines
- `body` — the comment text (see formats below)

### Plain comment body format

```
**[Severity]** Short description of the issue.

Explanation of why this matters or what could go wrong.
```

### Suggestion comment body format

For bugs or refinements with a clear fix, embed a fenced `suggestion` block. GitHub renders this as a one-click apply button:

```
**[Bug / Refinement]** Short description of the issue.

Brief explanation, then the suggested replacement:

~~~suggestion
exact replacement lines for the highlighted range
~~~
```

The suggestion block must contain **only the replacement lines** for the highlighted range — not surrounding context. If the fix spans multiple lines, set `start_line` to the first affected line and `line` to the last.

### Review summary body

Write a 2–5 sentence overall summary covering:
- What the PR does (validate against the stated description)
- The most significant findings
- A clear overall verdict: approve, request changes, or comment-only

### Review event

Choose the event based on findings:
- `"REQUEST_CHANGES"` — if there are any bugs or security issues
- `"COMMENT"` — if findings are only refinements, style notes, or questions
- `"APPROVE"` — if the code looks correct and no changes are needed

## Step 5: Post the review

Submit the review as a single API call. Posting all inline comments in one review call is required — do not post individual comments separately, and do not post any findings as ordinary (non-review) PR comments.

```bash
gh api repos/{owner}/{repo}/pulls/<pr-number>/reviews \
  --method POST \
  -f body="<review summary>" \
  -f event="<REQUEST_CHANGES|COMMENT|APPROVE>" \
  -F comments='[
    {
      "path": "<file-path>",
      "line": <line-number>,
      "side": "RIGHT",
      "body": "<comment body>"
    },
    {
      "path": "<file-path>",
      "start_line": <start>,
      "line": <end>,
      "side": "RIGHT",
      "body": "<comment with suggestion block>"
    }
  ]'
```

Replace `{owner}` and `{repo}` with the values from Step 1.

If the API call fails with a position error (line number not in the diff), re-check the unified diff from Step 1 and adjust the line to the nearest changed line within the same hunk.

## Step 6: Confirm with the user

Report:
- The PR number and title reviewed
- Count of findings posted: how many as suggestions, how many as plain comments
- The overall review verdict (approved / changes requested / comment)
- The URL to the posted review on GitHub
- Any findings that could not be posted as inline comments and the reason (e.g., the file was not in the diff, line number could not be resolved)
