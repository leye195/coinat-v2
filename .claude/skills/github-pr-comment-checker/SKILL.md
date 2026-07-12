---
name: github-pr-comment-checker
description: Fetches and summarizes a GitHub Pull Request's comments, reviews, and inline review threads, highlighting actionable feedback and optionally posting replies.
---

# GitHub Pull Request Comment Checker Skill

## Role

You are an expert in **GitHub PR review triage** for the **coinat-v2** monorepo.
You collect every kind of feedback on a Pull Request — issue comments, review summaries, and inline review threads — using the `gh` CLI, then present a concise, actionable summary and (on request) post replies to specific threads.

---

## Inputs

- **PR Number** (optional): The Pull Request to inspect.
  - If omitted, auto-detect from the current branch:
    ```bash
    gh pr list --head "$(git rev-parse --abbrev-ref HEAD)" --json number,url,title
    ```
    - If exactly one open PR maps to the branch, use it.
    - If none exists, tell the user there is no PR for this branch.
    - If the current branch is `develop`/`main`/`master`, ask the user for an explicit PR number instead of guessing.

---

## Workflow

1. **Resolve the PR**
   - Determine the PR number from the input or the current branch (see Inputs).
   - Capture basic metadata for the summary header:
     ```bash
     gh pr view <PR#> --json number,title,url,state,reviewDecision
     ```

2. **Collect all feedback** — three distinct sources; fetch each:
   - **Issue-level comments** (top-level conversation, incl. bot status like Vercel):
     ```bash
     gh pr view <PR#> --json comments
     ```
   - **Review summaries** (APPROVED / CHANGES_REQUESTED / COMMENTED bodies):
     ```bash
     gh pr view <PR#> --json reviews
     ```
   - **Inline review comments** (thread on a specific file/line — this is where most actionable code feedback lives):
     ```bash
     gh api repos/<owner>/<repo>/pulls/<PR#>/comments \
       --jq '.[] | {id: .id, author: .user.login, path: .path, line: .line, in_reply_to: .in_reply_to_id, body: .body}'
     ```
     - Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner -q .nameWithOwner` (do not hardcode).

3. **Triage & summarize** — present a structured Korean summary:
   - Group by source: **인라인 리뷰 코멘트** (파일:라인), **리뷰 요약**, **일반 코멘트**.
   - For each item show: author (봇 vs 사람 구분), location (`path:line` for inline), and a 1–2 line gist of the point.
   - **Flag actionable items** distinctly from informational/bot noise:
     - Actionable: code-change suggestions, questions directed at the author, `CHANGES_REQUESTED` reviews, priority-tagged bot findings (e.g. Gemini `high`/`medium`).
     - Informational: CI/deploy status (Vercel), approvals with no comments, resolved threads.
   - If a suggestion includes a ` ```suggestion ` block, surface the proposed code so the user can decide quickly.
   - Note that inline threads with `in_reply_to` are replies — group them under their parent so a resolved back-and-forth reads as one thread.

4. **Offer next steps** — after the summary, ask what the user wants:
   - Apply a suggested change, reply to a thread, resolve a thread, or nothing.
   - Do **not** modify code or post replies as part of merely *checking* — those are separate, explicit follow-up actions.

## Replying to a comment (only when the user asks)

- **Reply to an inline review thread** (use the target comment's `id`):
  ```bash
  gh api repos/<owner>/<repo>/pulls/<PR#>/comments/<comment_id>/replies \
    -f body="<reply text>" --jq '{id: .id, url: .html_url}'
  ```
- **Add a top-level conversation comment**:
  ```bash
  gh pr comment <PR#> --body "<text>"
  ```
- Write replies in **Korean** to match this repo's review culture. When a reply confirms a fix, reference the commit SHA that addressed it.
- Show the reply text and confirm with the user before posting.

---

## Key Considerations

- **Three sources, not one.** `gh pr view --json comments` does NOT include inline review comments — always also hit `pulls/<PR#>/comments` via `gh api`, or you will miss the most important feedback.
- **Owner/repo is dynamic.** Resolve it via `gh repo view`; never hardcode `leye195/coinat-v2`.
- **Checking ≠ acting.** This skill reports and summarizes by default. Editing code, replying, or resolving threads happen only on explicit user request.
- **Separate signal from noise.** Bot deploy/CI comments (Vercel) are informational; surface them briefly but lead with human-actionable feedback.
- **Confirm before posting.** Always preview reply text and get confirmation before running any `gh api ... /replies` or `gh pr comment`.
- **Environment**: If `gh` is not installed or not authenticated, surface the error and provide the PR URL so the user can review in the GitHub web UI.

---

## Example Interaction

**User**: "Check the comments on this PR."

**Assistant**:
"PR #35 `style(web): refine MainNews content preview display` (OPEN, no review decision yet).

**🟡 인라인 리뷰 코멘트 (actionable) — 1건**
- `gemini-code-assist[bot]` @ `apps/web/src/components/News/MainNews.tsx:37` (medium)
  → CSS로 이미지를 숨기는 대신 `DOMPurify.sanitize(..., { FORBID_TAGS: ['img'] })`로 `img` 태그를 제거할 것을 제안. (suggestion 블록 포함)

**ℹ️ 일반 코멘트 (informational)**
- `vercel[bot]` → Preview 배포 완료 (Ready).

제안을 반영하거나 답글을 달까요?"
