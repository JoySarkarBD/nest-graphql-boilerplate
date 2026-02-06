#!/usr/bin/env bash
set -euo pipefail

# Copies the hook templates into .git/hooks so they run locally.
# Run: `bash scripts/install-git-hooks.sh` from repository root.

HOOKS_DIR=".git/hooks"
if [ ! -d "$HOOKS_DIR" ]; then
  echo ".git/hooks not found. Are you running this from the repository root?"
  exit 1
fi

cp scripts/post-commit-hook.sh "$HOOKS_DIR/post-commit"
chmod +x "$HOOKS_DIR/post-commit"
echo "Installed post-commit hook. Commits will trigger a push to both remotes via origin's push URLs."
