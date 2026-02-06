#!/usr/bin/env bash
set -euo pipefail

# Template post-commit hook that calls the sync script.
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/sync-to-remotes.sh"
