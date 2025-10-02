#!/usr/bin/env bash
set -euo pipefail

# === CONFIGURE ===
REPO_OWNER="wesship"
REPO_NAME="lemon-ai"
ASSET_NAME="lemon-ai-linux-x64.tar.gz"
INSTALL_DIR="$HOME/.local/share/lemon-ai"
BIN_DIR="$HOME/.local/bin"
BIN_NAME="lemon-ai"
# ==================

echo "🔧 Lemon AI User Installer (no sudo required)"

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
mkdir -p "$INSTALL_DIR"
tar -xzf "${TMPDIR}/${ASSET_NAME}" -C "$INSTALL_DIR"

echo "🔗 Creating symlink..."
mkdir -p "$BIN_DIR"
ln -sf "${INSTALL_DIR}/${BIN_NAME}" "${BIN_DIR}/${BIN_NAME}"

# Add to PATH if not already present
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo "📝 Adding to PATH..."
  for rc in ~/.bashrc ~/.zshrc; do
    if [ -f "$rc" ]; then
      echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$rc"
    fi
  done
  echo "⚠️ Please restart your shell or run: source ~/.bashrc"
fi

echo "✅ Installation complete!"
echo "Run with: ${BIN_NAME}"
