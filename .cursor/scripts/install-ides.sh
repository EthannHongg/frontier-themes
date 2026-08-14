#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

if [[ ! -f /etc/apt/sources.list.d/vscode.list ]]; then
  sudo mkdir -p /etc/apt/keyrings
  if [[ ! -f /etc/apt/keyrings/microsoft.gpg ]]; then
    curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
      | sudo gpg --dearmor --batch --yes -o /etc/apt/keyrings/microsoft.gpg
  fi
  echo 'deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/code stable main' \
    | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null
fi

sudo apt-get update -qq
sudo apt-get install -y --no-install-recommends \
  code \
  dbus-x11 \
  gnome-keyring \
  libsecret-1-0 \
  scrot \
  wmctrl \
  xdotool \
  imagemagick
