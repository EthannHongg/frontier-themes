#!/usr/bin/env bash
# Capture VS Code theme demos.
# Avoids wmctrl/xdotool (they hang) and reuse of a killed user-data-dir
# (that triggers the "window terminated unexpectedly" dialog).
set -euo pipefail

ARTIFACTS_DIR="${ARTIFACTS_DIR:-/opt/cursor/artifacts}"
EXAMPLES_DIR="/workspace/examples"
mkdir -p "$ARTIFACTS_DIR"

source "$HOME/.local/bin/ide-env.sh"
export DISPLAY="${DISPLAY:-:1}"

write_profile() {
  local dir="$1"
  local theme="$2"
  mkdir -p "$dir/User"
  cat >"$dir/argv.json" <<'EOF'
{
  "password-store": "basic",
  "enable-crash-reporter": false
}
EOF
  python3 - "$dir/User/settings.json" "$theme" <<'PY'
import json, sys
from pathlib import Path
path = Path(sys.argv[1])
theme = sys.argv[2]
data = {
    "workbench.colorTheme": theme,
    "security.workspace.trust.enabled": False,
    "window.restoreWindows": "none",
    "window.newWindowDimensions": "maximized",
    "workbench.startupEditor": "none",
    "workbench.welcome.enabled": False,
    "update.mode": "none",
    "update.showReleaseNotes": False,
    "telemetry.telemetryLevel": "off",
    "extensions.ignoreRecommendations": True,
    "extensions.autoCheckUpdates": False,
    "extensions.autoUpdate": False,
    "workbench.enableExperiments": False,
    "workbench.tips.enabled": False,
    "workbench.secondarySideBar.defaultVisibility": "hidden",
    "workbench.editor.enablePreview": False,
    "workbench.statusBar.visible": True,
    "workbench.activityBar.visible": True,
    "chat.disableAIFeatures": True,
    "git.openRepositoryInParentFolders": "never",
    "editor.minimap.enabled": True,
    "editor.fontSize": 14,
    "frontierThemes.showStatusBarPicker": True,
}
path.write_text(json.dumps(data, indent=2) + "\n")
PY
}

stop_profile() {
  local dir="$1"
  mapfile -t pids < <(pgrep -f -- "--user-data-dir=${dir}" || true)
  if [[ ${#pids[@]} -gt 0 ]]; then
    kill "${pids[@]}" 2>/dev/null || true
    sleep 2
  fi
}

capture_theme() {
  local theme="$1"
  local file="$2"
  local output="$3"
  local profile="/tmp/vscode-demo-profile"
  echo "=== $theme -> $output ==="
  stop_profile "$profile"
  rm -rf "$profile"
  write_profile "$profile" "$theme"
  code "$EXAMPLES_DIR/examples.code-workspace" "$file" \
    --user-data-dir="$profile" \
    --extensions-dir="$HOME/.vscode/extensions" \
    --no-sandbox --disable-gpu --password-store=basic \
    --disable-workspace-trust --disable-crash-reporter \
    >/tmp/vscode-demo.log 2>&1 &
  sleep 20
  scrot -o "$ARTIFACTS_DIR/$output"
  local size
  size=$(stat -c%s "$ARTIFACTS_DIR/$output")
  echo "Saved $ARTIFACTS_DIR/$output ($size bytes)"
  if [[ "$size" -lt 80000 ]]; then
    echo "error: $output is too small ($size bytes)" >&2
    return 1
  fi
}

# Kill leftover default-profile VS Code from earlier attempts.
mapfile -t leftover < <(pgrep -f '/usr/share/code/code' || true)
if [[ ${#leftover[@]} -gt 0 ]]; then
  kill "${leftover[@]}" 2>/dev/null || true
  sleep 3
fi

capture_theme "Anthropic Dark" "$EXAMPLES_DIR/python.py" "demo_01_anthropic_dark_python.png"
capture_theme "Cursor Dark" "$EXAMPLES_DIR/markdown.md" "demo_02_cursor_dark_markdown.png"
capture_theme "NVIDIA Dark" "$EXAMPLES_DIR/main.go" "demo_03_nvidia_dark_go.png"
capture_theme "Vercel Dark" "$EXAMPLES_DIR/typescript.ts" "demo_04_vercel_dark_typescript.png"
capture_theme "OpenAI Dark" "$EXAMPLES_DIR/typescript.ts" "demo_05_openai_dark_typescript.png"
capture_theme "OpenAI Light" "$EXAMPLES_DIR/typescript.ts" "demo_06_openai_light_typescript.png"
capture_theme "Anthropic Light" "$EXAMPLES_DIR/python.py" "demo_07_anthropic_light_python.png"
capture_theme "Google Light" "$EXAMPLES_DIR/typescript.ts" "demo_08_google_light_typescript.png"
capture_theme "Linear Light" "$EXAMPLES_DIR/styles.css" "demo_09_linear_light_css.png"

stop_profile "/tmp/vscode-demo-profile"
echo "Done"
