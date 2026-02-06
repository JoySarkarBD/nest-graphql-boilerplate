Dual-Remote Git Sync — Step-by-step

Purpose
-------
This document captures the exact steps, commands and helper scripts used to configure a local repository so that pushing to `origin` pushes to two separate GitHub repositories automatically. Use this as a template for other codebases.

Context
-------
- Two GitHub repository URLs used in the example:
  - https://github.com/JoySarkarBD/nest-graphql-boilerplate.git
  - https://github.com/JoySarkarBD/nest-graphql-boilerplate-mirror.git
- Goal: Keep both repositories synchronized when developers push from their local machines.

Prerequisites
-------------
- Git installed and network access to both GitHub repositories.
- Proper authentication configured (HTTPS credentials or SSH). The example uses HTTPS URLs.

High-level approach
-------------------
1. Initialize (or use existing) local repository.
2. Configure `origin` so that it has two push URLs (one for each remote repo).
3. Push branches and tags to `origin` (Git will push to both push URLs).
4. Optionally add helper scripts and a local `post-commit` hook to auto-sync.

Exact commands used (Unix / Git Bash / WSL)
-----------------------------------------
1. Check remotes (if repo already initialized):

```bash
git remote -v
```

2. If this directory is not yet a git repo, initialize and make the initial commit:

```bash
git init
git config user.email "sync@local"
git config user.name "Repo Sync"
git add -A
git commit -m "Initial commit"
git branch -M main
```

3. Add `origin` (if not present) and set two push URLs on it:

```bash
git remote add origin https://github.com/JoySarkarBD/nest-graphql-boilerplate.git
# Add both push URLs (order does not matter)
git remote set-url --add --push origin https://github.com/JoySarkarBD/nest-graphql-boilerplate.git
git remote set-url --add --push origin https://github.com/JoySarkarBD/nest-graphql-boilerplate-mirror.git

# Verify remotes and push URLs
git remote -v
```

4. Push branches and tags to origin (this sends them to both push URLs):

```bash
git push -u origin main
git push --tags origin
```

Notes: If any of the remote repositories already contain commits that conflict with your local history, adjust using fetch/merge/rebase before pushing.

Helper scripts created
----------------------
Three small helper scripts were added to this repository to make reuse simple.

1) `scripts/sync-to-remotes.sh` — pushes all branches and tags to `origin`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Push all branches and tags to the configured `origin` (with multiple push URLs)
git push --all origin
git push --tags origin

```

2) `scripts/post-commit-hook.sh` — template for a local `post-commit` hook that calls the sync script:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Template post-commit hook that calls the sync script.
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/sync-to-remotes.sh"

```

3) `scripts/install-git-hooks.sh` — copies the template into `.git/hooks` and makes it executable:

```bash
#!/usr/bin/env bash
set -euo pipefail

HOOKS_DIR=".git/hooks"
if [ ! -d "$HOOKS_DIR" ]; then
  echo ".git/hooks not found. Are you running this from the repository root?"
  exit 1
fi

cp scripts/post-commit-hook.sh "$HOOKS_DIR/post-commit"
chmod +x "$HOOKS_DIR/post-commit"
echo "Installed post-commit hook. Commits will trigger a push to both remotes via origin's push URLs."

```

How to use the helper scripts locally
-------------------------------------
1. Install the hook (run once per local clone):

```bash
bash scripts/install-git-hooks.sh
```

2. Commit as usual. After each commit, the `post-commit` hook will call `scripts/sync-to-remotes.sh`, which pushes all branches and tags to `origin` (and therefore to both configured push URLs).

3. To manually sync at any time:

```bash
bash scripts/sync-to-remotes.sh
```

Windows PowerShell notes
------------------------
- The helper scripts are written for POSIX shells (Git Bash / WSL). If developers use PowerShell natively, create an equivalent PowerShell hook script, e.g. `scripts/post-commit-hook.ps1` that calls `git push --all origin; git push --tags origin`.
- Install hook on Windows by copying the script to `.git\hooks\post-commit` and ensuring it is executable by Git Bash or invoking PowerShell explicitly from the hook.

Limitations & caveats
---------------------
- Git hooks are local only and are not versioned with the repository. Each developer must run the installer script locally, or you can use a tool like `husky` or a `Makefile` to automate setup.
- If you need server-side guaranteed mirroring (independent of client hooks), set up a CI workflow or GitHub Action that mirrors pushes from one repository to the other.
- Concurrent pushes to different repos could diverge if someone pushes directly to only one of the remote repos. Enforce a policy or use server-side mirroring.

Optional: GitHub Action to mirror pushes server-side
--------------------------------------------------
If you prefer repository-level mirroring (no client hooks), add a GitHub Action in the primary repository that pushes to the mirror whenever `main` (or other branches) are updated. Example minimal workflow:

```yaml
name: Mirror to another repo
on:
  push:
    branches: [ main ]

jobs:
  mirror:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Push to mirror
        env:
          MIRROR_REPO: https://x-access-token:${{ secrets.PERSONAL_ACCESS_TOKEN }}@github.com/JoySarkarBD/nest-graphql-boilerplate-mirror.git
        run: |
          git push --all "$MIRROR_REPO"
          git push --tags "$MIRROR_REPO"

```

Notes for that workflow:
- Create a `PERSONAL_ACCESS_TOKEN` secret with `repo` scope in the primary repo to allow pushing to the mirror.
- This is a safer server-side approach because it does not rely on individual developers' hooks.

Summary checklist (copy to other repos)
--------------------------------------
- [ ] Ensure remote repo URLs are available & accessible.
- [ ] Initialize local repo (if not already) and create initial commit.
- [ ] Configure `origin` push URLs for both repos:

```bash
git remote set-url --add --push origin <primary-repo-url>
git remote set-url --add --push origin <mirror-repo-url>
```

- [ ] Push branches & tags: `git push --all origin && git push --tags origin`.
- [ ] (Optional) Copy `scripts/` and run `bash scripts/install-git-hooks.sh` in each clone to enable local auto-sync via `post-commit`.
- [ ] (Optional) Add a CI/GitHub Action to perform server-side mirroring.

Contact / provenance
--------------------
These exact steps were performed interactively in the repository root on Windows (PowerShell working directory) during a setup session. Helper scripts were added to `scripts/` and an installer script was added to copy hook templates into `.git/hooks`.

End of document
