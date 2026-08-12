#!/usr/bin/env bash
# Shell sample — keywords, strings, variables, builtins

set -euo pipefail

readonly BRAND="${1:-openai}"
readonly MODE="${2:-dark}"
LOG_FILE="/tmp/frontier-themes-preview.log"

log() {
  local level="$1"
  shift
  printf '[%s] %s\n' "$level" "$*" | tee -a "$LOG_FILE"
}

generate_theme() {
  local brand="$1"
  local mode="$2"
  log INFO "Generating ${brand}-${mode}..."
  npm run generate --silent
  log OK "Wrote themes/${brand}-${mode}.json"
}

main() {
  if [[ ! -f package.json ]]; then
    log ERROR "Run from repo root"
    exit 1
  fi

  for mode in dark light; do
    generate_theme "$BRAND" "$mode"
  done

  # ANSI preview in integrated terminal
  echo -e "\033[31mred\033[0m \033[32mgreen\033[0m \033[33myellow\033[0m \033[34mblue\033[0m \033[35mmagenta\033[0m \033[36mcyan\033[0m"
}

main "$@"
