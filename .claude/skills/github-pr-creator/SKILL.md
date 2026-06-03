---
name: github-pr-creator
description: Generates and creates a Pull Request on GitHub based on current branch changes.
---

# GitHub Pull Request Creator Skill

## Role

You are an expert in **GitHub workflow and PR automation** for the **coinat-v2** monorepo.
You analyze local changes, compare them against the target branch (default `develop`), and use the `gh` CLI to create a structured Pull Request that follows this project's template and conventions.

---

## Workflow

1. **Pre-check & Branch Detection**
   - Current branch: `git rev-parse --abbrev-ref HEAD`. If it is `develop`, stop and ask the user to switch to a feature branch first.
   - Target branch: default `develop` unless the user specifies otherwise.
   - Existing PR check: `gh pr list --head <current-branch> --json number,url`. If one exists, share the link instead of creating a duplicate.
   - Push state: compare local vs remote.
     ```bash
     git rev-list --left-right --count @{u}...HEAD 2>/dev/null
     ```
     - If there is no upstream, push: `git push -u origin <current-branch>`.
     - If the local branch is ahead, push: `git push`.
     - Only create the PR once the remote tip matches local `HEAD`.

2. **Analysis & Content Generation**
   - Read `.github/pull_request_template.md` and follow its structure **exactly**.
   - Analyze the diff: `git diff <target-branch>...HEAD` and `git log <target-branch>..HEAD --oneline`.
   - **PR Title** — Conventional Commits style in **English**, matching this repo's history (e.g. `feat(web): update RATE_API`, `refactor: improve real-time data handling`). Use a scope of `web` or `api` when the change is confined to one app; omit the scope for monorepo-wide / tooling changes.
   - **PR Body** — write in **Korean** to match the template, filling each section:
     - `# 요약` — high-level goal (1–2 lines).
     - `## 주요 작업:` — primary technical changes (bullets).
     - `## 기타 작업:` — secondary/incidental changes (config, tooling, cleanup).
     - `## 고민사항 및 추후 고려사항:` — trade-offs, follow-ups, reviewer notes, intentionally excluded changes.

3. **Auto-Label Detection**
   - **Always** run `gh label list --json name` first and apply **only labels that actually exist** in the repo. Never pass a label that is not returned.
   - Map the dominant commit type to a label:

     | Commit Type | Label |
     | ----------- | ----- |
     | `feat` | `enhancement` |
     | `fix` | `bug` |
     | `docs` | `documentation` |
     | `refactor`, `perf`, `chore`, `style`, `test` | _(no label)_ |

   - This repo currently has **no path/app-scoped labels** (no `web`/`api`/`admin`/`i18n`). Do not invent them; rely on `gh label list`. If the repo later adds scoped labels, extend this section accordingly.
   - The current label set is roughly: `bug`, `documentation`, `enhancement`, `duplicate`, `question`, `wontfix`, `invalid`, `good first issue`, `help wanted`, `codex`. Treat `gh label list` as the source of truth.
   - Combine detected labels into a comma-separated string (e.g. `enhancement`). If none apply, omit `--label`.

4. **PR Creation**
   - Create the PR (use a heredoc for the body to preserve newlines/markdown):
     ```bash
     gh pr create --base <target-branch> --head <current-branch> \
       --title "<title>" \
       --body "$(cat <<'EOF'
     <generated-korean-body>
     EOF
     )" \
       --label "<detected-labels>"
     ```
   - Omit `--label` when no label was detected.
   - **Environment Note**: If `gh` is not installed/authenticated, output the full title + body so the user can paste it into the GitHub web UI.
   - On success, share the PR link.

---

## Key Considerations

- **Target Branch**: default `develop`.
- **Title language**: English, Conventional Commits, with `web`/`api` scope when single-app.
- **Body language**: Korean, strictly following `.github/pull_request_template.md`.
- **Labels**: existing labels only — verify via `gh label list` before applying.
- **No duplicates**: check for an existing PR on the branch first.
- **Push first**: never create a PR before the branch is pushed and in sync.

---

## Example Interaction

**User**: "Create a PR for this branch."
**Assistant**: "Current branch `feat/rate-api` is pushed and in sync with origin. I'll open a PR to `develop`. Based on the diff (changes only under `apps/web`), proposed title: `feat(web): update RATE_API`. Body follows our template (요약/주요 작업/기타 작업/고민사항). Detected label: `enhancement` (verified via `gh label list`). Proceeding with `gh pr create`."
