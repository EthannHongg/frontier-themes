#!/usr/bin/env bash
set -euo pipefail

IDE="${1:-}"
OUTPUT="${2:-}"
WORKSPACE="${3:-/workspace}"

if [[ -z "$IDE" || -z "$OUTPUT" ]]; then
  echo "Usage: $0 <cursor|vscode> <output.png> [workspace]" >&2
  exit 1
fi

source "$HOME/.local/bin/ide-env.sh"

stop_ide() {
  local pattern="$1"
  local pids
  pids=$(pgrep -f "$pattern" || true)
  if [[ -n "$pids" ]]; then
    kill $pids 2>/dev/null || true
    sleep 3
  fi
}

case "$IDE" in
  cursor) stop_ide '/usr/share/cursor/cursor' ;;
  vscode) stop_ide '/usr/share/code/code' ;;
esac

case "$IDE" in
  cursor)
    "$HOME/.local/bin/open-cursor" "$WORKSPACE" >/tmp/cursor-launch.log 2>&1 &
  ;;
  vscode)
    "$HOME/.local/bin/open-vscode" "$WORKSPACE" >/tmp/vscode-launch.log 2>&1 &
  ;;
esac

for _ in $(seq 1 45); do
  sleep 1
  if wmctrl -l | rg -qi 'Cursor|Visual Studio Code|workspace'; then
    break
  fi
done

sleep 6

WIN_HEX=""
if [[ "$IDE" == "cursor" ]]; then
  WIN_HEX=$(wmctrl -l | rg 'Cursor' | rg -v 'xfce|Desktop|panel|plank' | awk '{print $1}' | head -1)
  wmctrl -i -a "$WIN_HEX" 2>/dev/null || true
  sleep 1
  xdotool key Tab Tab Return 2>/dev/null || true
else
  WIN_HEX=$(wmctrl -l | rg 'Visual Studio Code' | awk '{print $1}' | head -1)
  wmctrl -i -a "$WIN_HEX" 2>/dev/null || true
  sleep 1
  xdotool key Escape 2>/dev/null || true
fi

sleep 1
xdotool key ctrl+shift+e 2>/dev/null || true
sleep 2

if [[ -n "$WIN_HEX" ]]; then
  WIN_DEC=$((WIN_HEX))
  wmctrl -i -r "$WIN_HEX" -b add,maximized_vert,maximized_horz 2>/dev/null || true
  xdotool windowactivate --sync "$WIN_DEC"
  sleep 1
  import -window "$WIN_DEC" "$OUTPUT"
else
  scrot "$OUTPUT"
fi

echo "Saved screenshot to $OUTPUT"
