#!/usr/bin/env bash
set -euo pipefail

if [[ -f .cursor/scripts/setup-ides.sh ]]; then
  bash .cursor/scripts/setup-ides.sh
fi

source "$HOME/.local/bin/ide-env.sh" 2>/dev/null || true
