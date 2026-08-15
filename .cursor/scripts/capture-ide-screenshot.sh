#!/usr/bin/env bash
set -euo pipefail

OUTPUT="${1:-}"
WORKSPACE="${2:-/workspace}"

if [[ -z "$OUTPUT" ]]; then
  echo "Usage: $0 <output.png> [workspace]" >&2
  exit 1
fi

source "$HOME/.local/bin/ide-env.sh"

pids=$(pgrep -f '/usr/share/code/code' || true)
if [[ -n "$pids" ]]; then
  kill $pids 2>/dev/null || true
  sleep 3
fi

"$HOME/.local/bin/open-vscode" "$WORKSPACE" >/tmp/vscode-launch.log 2>&1 &

for _ in $(seq 1 45); do
  sleep 1
  if wmctrl -l | rg -qi 'Visual Studio Code|workspace'; then
    break
  fi
done

sleep 6

WIN_HEX=$(wmctrl -l | rg 'Visual Studio Code' | awk '{print $1}' | head -1)
if [[ -n "$WIN_HEX" ]]; then
  wmctrl -i -a "$WIN_HEX" 2>/dev/null || true
  sleep 1
  xdotool key Escape 2>/dev/null || true
  sleep 1
  xdotool key ctrl+shift+e 2>/dev/null || true
  sleep 2

  WIN_DEC=$((WIN_HEX))
  wmctrl -i -r "$WIN_HEX" -b add,maximized_vert,maximized_horz 2>/dev/null || true
  xdotool windowactivate --sync "$WIN_DEC"
  sleep 1
  import -window "$WIN_DEC" "$OUTPUT"
else
  scrot "$OUTPUT"
fi

echo "Saved screenshot to $OUTPUT"
