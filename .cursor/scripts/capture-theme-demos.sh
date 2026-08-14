#!/usr/bin/env bash
set -euo pipefail

ARTIFACTS_DIR="${ARTIFACTS_DIR:-/opt/cursor/artifacts}"
EXAMPLES_DIR="/workspace/examples"
SETTINGS_FILE="$HOME/.config/Code/User/settings.json"
mkdir -p "$ARTIFACTS_DIR"

source "$HOME/.local/bin/ide-env.sh"

set_theme() {
  local theme="$1"
  python3 - <<PY
import json
from pathlib import Path
path = Path("$SETTINGS_FILE")
data = {}
if path.exists():
    data = json.loads(path.read_text())
data.update({
    "workbench.colorTheme": "$theme",
    "workbench.activityBar.visible": True,
    "workbench.statusBar.visible": True,
    "workbench.secondarySideBar.defaultVisibility": "hidden",
    "workbench.editor.enablePreview": False,
    "editor.minimap.enabled": True,
    "editor.fontSize": 14,
    "window.zoomLevel": 0,
    "frontierThemes.showStatusBarPicker": True,
    "extensions.ignoreRecommendations": True,
})
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(data, indent=2) + "\n")
PY
}

stop_vscode() {
  local pids
  pids=$(pgrep -f '/usr/share/code/code' || true)
  if [[ -n "$pids" ]]; then
    kill $pids 2>/dev/null || true
    sleep 4
  fi
}

get_vscode_window() {
  wmctrl -l | rg 'Visual Studio Code|Examples' | awk '{print $1}' | head -1
}

prepare_window() {
  local win_hex
  win_hex=$(get_vscode_window)
  [[ -n "$win_hex" ]] || return 1
  local win_dec=$((win_hex))
  wmctrl -i -a "$win_hex" 2>/dev/null || true
  sleep 1
  wmctrl -i -r "$win_hex" -b add,maximized_vert,maximized_horz 2>/dev/null || true
  xdotool windowactivate --sync "$win_dec"
  sleep 1
  xdotool key Escape Escape
  sleep 0.5
  xdotool key ctrl+b
  sleep 0.3
  xdotool key ctrl+shift+e
  sleep 1
}

capture_window() {
  local output="$1"
  local win_hex
  win_hex=$(get_vscode_window)
  [[ -n "$win_hex" ]] || { echo "missing window for $output" >&2; return 1; }
  prepare_window
  local win_dec=$((win_hex))
  import -window "$win_dec" "$ARTIFACTS_DIR/$output"
  local size
  size=$(stat -c%s "$ARTIFACTS_DIR/$output")
  if [[ "$size" -lt 80000 ]]; then
    echo "warning: $output looks too small ($size bytes), retrying" >&2
    sleep 5
    import -window "$win_dec" "$ARTIFACTS_DIR/$output"
  fi
  echo "Saved $ARTIFACTS_DIR/$output ($(stat -c%s "$ARTIFACTS_DIR/$output") bytes)"
}

launch_vscode() {
  local file="$1"
  stop_vscode
  code "$EXAMPLES_DIR/examples.code-workspace" "$file" \
    --no-sandbox --disable-gpu --password-store=basic >/tmp/vscode-demo.log 2>&1 &
  for _ in $(seq 1 60); do
    sleep 1
    if wmctrl -l | rg -qi 'Visual Studio Code|Examples'; then
      break
    fi
  done
  sleep 12
}

capture_theme_editor() {
  local theme="$1"
  local file="$2"
  local output="$3"
  set_theme "$theme"
  launch_vscode "$file"
  capture_window "$output"
}

capture_theme_picker() {
  set_theme "OpenAI Dark"
  launch_vscode "$EXAMPLES_DIR/typescript.ts"
  prepare_window
  xdotool key ctrl+shift+p
  sleep 1
  xdotool type 'Frontier Themes: Pick Theme'
  sleep 1
  xdotool key Return
  sleep 2
  capture_window "screenshot_theme_picker.png"
}

capture_split_view() {
  set_theme "Vercel Dark"
  launch_vscode "$EXAMPLES_DIR/typescript.ts"
  prepare_window
  xdotool key ctrl+backslash
  sleep 1
  xdotool key ctrl+2
  sleep 0.5
  xdotool type 'python.py'
  sleep 0.5
  xdotool key Return
  sleep 2
  capture_window "screenshot_vercel_dark_split.png"
}

capture_theme_editor "OpenAI Dark" "$EXAMPLES_DIR/typescript.ts" "screenshot_openai_dark_typescript.png"
capture_theme_editor "Anthropic Dark" "$EXAMPLES_DIR/python.py" "screenshot_anthropic_dark_python.png"
capture_theme_editor "Google Light" "$EXAMPLES_DIR/typescript.ts" "screenshot_google_light_typescript.png"
capture_theme_editor "Cursor Dark" "$EXAMPLES_DIR/markdown.md" "screenshot_cursor_dark_markdown.png"
capture_theme_editor "Linear Light" "$EXAMPLES_DIR/styles.css" "screenshot_linear_light_css.png"
capture_theme_editor "NVIDIA Dark" "$EXAMPLES_DIR/main.go" "screenshot_nvidia_dark_go.png"
capture_theme_picker
capture_split_view

echo "Done"
