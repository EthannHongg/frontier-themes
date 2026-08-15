#!/usr/bin/env bash
set -euo pipefail

mkdir -p "$HOME/.config/Code/User" "$HOME/.local/bin"

mkdir -p "$HOME/.config/Code"
cat >"$HOME/.config/Code/argv.json" <<'EOF'
{
  "password-store": "basic",
  "enable-crash-reporter": false
}
EOF

cat >"$HOME/.config/Code/User/settings.json" <<'EOF'
{
  "security.workspace.trust.enabled": false,
  "window.restoreWindows": "none",
  "window.newWindowDimensions": "maximized",
  "workbench.startupEditor": "none",
  "workbench.welcome.enabled": false,
  "update.mode": "none",
  "update.showReleaseNotes": false,
  "telemetry.telemetryLevel": "off",
  "extensions.ignoreRecommendations": true,
  "extensions.autoCheckUpdates": false,
  "extensions.autoUpdate": false,
  "workbench.enableExperiments": false,
  "workbench.tips.enabled": false,
  "workbench.secondarySideBar.defaultVisibility": "hidden",
  "workbench.editor.enablePreview": false,
  "workbench.statusBar.visible": true,
  "chat.disableAIFeatures": true,
  "git.openRepositoryInParentFolders": "never"
}
EOF

cat >"$HOME/.local/bin/ide-env.sh" <<'EOF'
#!/usr/bin/env bash
export DISPLAY="${DISPLAY:-:1}"

if [[ -z "${DBUS_SESSION_BUS_ADDRESS:-}" ]]; then
  eval "$(dbus-launch --sh-syntax)"
  export DBUS_SESSION_BUS_ADDRESS
fi

if ! pgrep -u "$(id -u)" gnome-keyring-daemon >/dev/null 2>&1; then
  eval "$(gnome-keyring-daemon --start --components=secrets)"
  export GNOME_KEYRING_CONTROL
  export SSH_AUTH_SOCK
fi
EOF

cat >"$HOME/.local/bin/open-vscode" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
source "$HOME/.local/bin/ide-env.sh"
exec code "$@" --no-sandbox --disable-gpu --password-store=basic
EOF

chmod +x "$HOME/.local/bin/ide-env.sh" "$HOME/.local/bin/open-vscode"

if ! grep -q 'IDE launch helpers' "$HOME/.bashrc" 2>/dev/null; then
  cat >>"$HOME/.bashrc" <<'EOF'

# VS Code launch helper for Cloud Agent desktops
export PATH="$HOME/.local/bin:$PATH"
EOF
fi
