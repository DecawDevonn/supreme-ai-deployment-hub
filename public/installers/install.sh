#!/usr/bin/env bash
set -euo pipefail

# === CONFIGURE ===
REPO_OWNER="wesship"
REPO_NAME="lemon-ai"
ASSET_NAME="lemon-ai-linux-x64.tar.gz"
INSTALL_DIR="/opt/lemon-ai"
BIN_NAME="lemon-ai"
# ==================

echo "🔧 Installer Lemon AI — one-click installer (Linux/macOS)"

# Detect downloader
if command -v curl >/dev/null 2>&1; then
  DL="curl -fsSL"
elif command -v wget >/dev/null 2>&1; then
  DL="wget -qO-"
else
  echo "Error: curl or wget required." >&2
  exit 1
fi

# Fetch latest release
LATEST_JSON="$($DL https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest)"
if [ -z "$LATEST_JSON" ]; then
  echo "❌ Could not fetch release info." >&2
  exit 1
fi

ASSET_URL=$(echo "$LATEST_JSON" | python3 -c "import sys, json; j=json.load(sys.stdin); 
for a in j['assets']:
  if a['name'] == '${ASSET_NAME}': print(a['browser_download_url'])")

if [ -z "$ASSET_URL" ]; then
  echo "❌ Asset not found: ${ASSET_NAME}" >&2
  exit 1
fi

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "⬇️ Downloading ${ASSET_NAME}..."
curl -L --progress-bar "$ASSET_URL" -o "${TMPDIR}/${ASSET_NAME}"

echo "📦 Extracting..."
sudo mkdir -p "$INSTALL_DIR"
sudo tar -xzf "${TMPDIR}/${ASSET_NAME}" -C "$INSTALL_DIR"

echo "🔗 Linking binary..."
sudo ln -sf "${INSTALL_DIR}/${BIN_NAME}" /usr/local/bin/${BIN_NAME}

echo "✅ Installation complete!"
echo "Run with: ${BIN_NAME}"
