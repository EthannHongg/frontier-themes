#!/usr/bin/env bash
set -euo pipefail

bash .cursor/scripts/install-ides.sh
bash .cursor/scripts/setup-ides.sh

if [[ -f package.json ]]; then
  npm ci
fi
