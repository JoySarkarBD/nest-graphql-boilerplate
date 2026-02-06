#!/usr/bin/env bash
set -euo pipefail

# Push all branches and tags to the configured `origin` (which has multiple push URLs).
git push --all origin
git push --tags origin
