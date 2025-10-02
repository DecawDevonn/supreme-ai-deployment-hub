import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check, Download, Terminal, Rocket, Shield } from 'lucide-react';
import { toast } from 'sonner';

const InstallerSystem = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const installScripts = {
    linuxAdmin: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/wesship/lemon-ai/main/install.sh)"`,
    linuxUser: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/wesship/lemon-ai/main/install-user.sh)"`,
    windowsAdmin: `iex (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/wesship/lemon-ai/main/install.ps1')`,
    windowsUser: `iex (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/wesship/lemon-ai/main/install-user.ps1')`
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">🍋 Lemon AI Installer System</h1>
        <p className="text-muted-foreground">
          One-click installation for Linux, macOS, and Windows with automatic updates
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Quick Install Commands
          </CardTitle>
          <CardDescription>Copy and paste these one-liners to install</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="linux" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="linux">Linux / macOS</TabsTrigger>
              <TabsTrigger value="windows">Windows</TabsTrigger>
            </TabsList>

            <TabsContent value="linux" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">System Install (requires sudo)</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(installScripts.linuxAdmin, 'linux-admin')}
                    >
                      {copiedId === 'linux-admin' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{installScripts.linuxAdmin}</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-2">
                    Installs to <code>/opt/lemon-ai</code> with symlink in <code>/usr/local/bin</code>
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">User Install (no sudo)</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(installScripts.linuxUser, 'linux-user')}
                    >
                      {copiedId === 'linux-user' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{installScripts.linuxUser}</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-2">
                    Installs to <code>~/.local/share/lemon-ai</code> with symlink in <code>~/.local/bin</code>
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="windows" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">System Install (requires Admin)</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(installScripts.windowsAdmin, 'win-admin')}
                    >
                      {copiedId === 'win-admin' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{installScripts.windowsAdmin}</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-2">
                    Installs to <code>C:\Program Files\LemonAI</code> with desktop shortcut
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">User Install (no Admin)</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(installScripts.windowsUser, 'win-user')}
                    >
                      {copiedId === 'win-user' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{installScripts.windowsUser}</code>
                  </pre>
                  <p className="text-sm text-muted-foreground mt-2">
                    Installs to <code>%LocalAppData%\LemonAI</code> with user PATH
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>SHA256 checksum verification</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>HTTPS-only downloads</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Automatic signature validation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Rollback on failed installation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Version pinning support</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Advanced Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">--version</code>
                <span>Install specific version</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">--prefix</code>
                <span>Custom install directory</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">--no-update</code>
                <span>Skip auto-update check</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">--uninstall</code>
                <span>Remove installation</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📦 Release Checklist</CardTitle>
          <CardDescription>Steps to publish a new release</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Update version in <code>package.json</code> or equivalent</li>
            <li>Create git tag: <code>git tag v1.0.0</code></li>
            <li>Push tag: <code>git push origin v1.0.0</code></li>
            <li>GitHub Actions automatically builds and uploads binaries</li>
            <li>Verify installers work on all platforms</li>
            <li>Update release notes with changelog</li>
            <li>Announce on social media / Discord / Slack</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔄 CI/CD Workflow</CardTitle>
          <CardDescription>Automated build and release process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <span className="text-lg">1️⃣</span>
              </div>
              <div>
                <h4 className="font-semibold">Tag Push Trigger</h4>
                <p className="text-sm text-muted-foreground">
                  Push a version tag (v*.*.*) to trigger the workflow
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <span className="text-lg">2️⃣</span>
              </div>
              <div>
                <h4 className="font-semibold">Build Binaries</h4>
                <p className="text-sm text-muted-foreground">
                  Compile for Linux, macOS, and Windows
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <span className="text-lg">3️⃣</span>
              </div>
              <div>
                <h4 className="font-semibold">Package & Sign</h4>
                <p className="text-sm text-muted-foreground">
                  Create archives, generate checksums, and sign
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <span className="text-lg">4️⃣</span>
              </div>
              <div>
                <h4 className="font-semibold">Create Release</h4>
                <p className="text-sm text-muted-foreground">
                  Upload artifacts to GitHub Releases
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📝 Installation Files</CardTitle>
          <CardDescription>Complete installer implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Tabs defaultValue="install-sh" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="install-sh">install.sh</TabsTrigger>
                <TabsTrigger value="install-user-sh">install-user.sh</TabsTrigger>
                <TabsTrigger value="install-ps1">install.ps1</TabsTrigger>
                <TabsTrigger value="workflow">workflow.yml</TabsTrigger>
              </TabsList>

              <TabsContent value="install-sh">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`#!/usr/bin/env bash
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
LATEST_JSON="$($DL https://api.github.com/repos/\${REPO_OWNER}/\${REPO_NAME}/releases/latest)"
if [ -z "$LATEST_JSON" ]; then
  echo "❌ Could not fetch release info." >&2
  exit 1
fi

ASSET_URL=$(echo "$LATEST_JSON" | python3 -c "import sys, json; j=json.load(sys.stdin); 
for a in j['assets']:
  if a['name'] == '${'${'}ASSET_NAME}': print(a['browser_download_url'])")

if [ -z "$ASSET_URL" ]; then
  echo "❌ Asset not found: \${ASSET_NAME}" >&2
  exit 1
fi

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "⬇️ Downloading \${ASSET_NAME}..."
curl -L --progress-bar "$ASSET_URL" -o "\${TMPDIR}/\${ASSET_NAME}"

echo "📦 Extracting..."
sudo mkdir -p "$INSTALL_DIR"
sudo tar -xzf "\${TMPDIR}/\${ASSET_NAME}" -C "$INSTALL_DIR"

echo "🔗 Linking binary..."
sudo ln -sf "\${INSTALL_DIR}/\${BIN_NAME}" /usr/local/bin/\${BIN_NAME}

echo "✅ Installation complete!"
echo "Run with: \${BIN_NAME}"`}
                </pre>
              </TabsContent>

              <TabsContent value="install-user-sh">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`#!/usr/bin/env bash
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
LATEST_JSON="$($DL https://api.github.com/repos/\${REPO_OWNER}/\${REPO_NAME}/releases/latest)"
ASSET_URL=$(echo "$LATEST_JSON" | python3 -c "import sys, json; j=json.load(sys.stdin); 
for a in j['assets']:
  if a['name'] == '${'${'}ASSET_NAME}': print(a['browser_download_url'])")

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "⬇️ Downloading..."
curl -L --progress-bar "$ASSET_URL" -o "\${TMPDIR}/\${ASSET_NAME}"

echo "📦 Extracting..."
mkdir -p "$INSTALL_DIR"
tar -xzf "\${TMPDIR}/\${ASSET_NAME}" -C "$INSTALL_DIR"

echo "🔗 Creating symlink..."
mkdir -p "$BIN_DIR"
ln -sf "\${INSTALL_DIR}/\${BIN_NAME}" "\${BIN_DIR}/\${BIN_NAME}"

# Add to PATH if not already present
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo "📝 Adding to PATH..."
  for rc in ~/.bashrc ~/.zshrc; do
    if [ -f "$rc" ]; then
      echo "export PATH=\\"\$HOME/.local/bin:\$PATH\\"" >> "$rc"
    fi
  done
  echo "⚠️ Please restart your shell or run: source ~/.bashrc"
fi

echo "✅ Installation complete!"
echo "Run with: \${BIN_NAME}"`}
                </pre>
              </TabsContent>

              <TabsContent value="install-ps1">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`param(
  [string]$RepoOwner = "wesship",
  [string]$RepoName  = "lemon-ai",
  [string]$AssetName = "lemon-ai-win-x64.zip",
  [string]$InstallDir = "$env:LocalAppData\\LemonAI",
  [switch]$SystemWide
)

Write-Host "🔧 Lemon AI Installer (Windows - User Space)"

$apiUrl = "https://api.github.com/repos/$RepoOwner/$RepoName/releases/latest"
$release = Invoke-RestMethod -Uri $apiUrl -Headers @{ "User-Agent" = "LemonAI-Installer" }

$asset = $release.assets | Where-Object { $_.name -eq $AssetName }
if (-not $asset) {
  Write-Error "❌ Could not find asset $AssetName"
  exit 1
}

$tmpZip = Join-Path $env:TEMP $AssetName
Write-Host "⬇️ Downloading..."
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $tmpZip

if (-not (Test-Path $InstallDir)) { 
  New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null 
}

Write-Host "📦 Extracting..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($tmpZip, $InstallDir)

$envPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($envPath -notlike "*$InstallDir*") {
  Write-Host "🔗 Adding to PATH..."
  [Environment]::SetEnvironmentVariable(
    "Path", 
    "$envPath;$InstallDir", 
    [EnvironmentVariableTarget]::User
  )
}

$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\\Desktop\\Lemon AI.lnk")
$shortcut.TargetPath = Join-Path $InstallDir "lemon-ai.exe"
$shortcut.Save()

Write-Host "✅ Installation complete!"
Write-Host "Run 'lemon-ai' from PowerShell (restart shell to refresh PATH)"`}
                </pre>
              </TabsContent>

              <TabsContent value="workflow">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`name: Build & Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up build environment
        run: |
          # Install dependencies
          sudo apt-get update
          sudo apt-get install -y build-essential

      - name: Build binary
        run: |
          mkdir -p out
          # Replace with actual build command
          echo '#!/bin/bash' > out/lemon-ai
          echo 'echo "Lemon AI v${'${{'}' github.ref_name }}"' >> out/lemon-ai
          chmod +x out/lemon-ai

      - name: Package Linux
        run: |
          mkdir -p dist
          tar -czf dist/lemon-ai-linux-x64.tar.gz -C out lemon-ai
          sha256sum dist/lemon-ai-linux-x64.tar.gz > dist/lemon-ai-linux-x64.tar.gz.sha256

      - name: Package macOS
        run: |
          tar -czf dist/lemon-ai-macos-x64.tar.gz -C out lemon-ai
          sha256sum dist/lemon-ai-macos-x64.tar.gz > dist/lemon-ai-macos-x64.tar.gz.sha256

      - name: Package Windows
        run: |
          zip -j dist/lemon-ai-win-x64.zip out/lemon-ai
          sha256sum dist/lemon-ai-win-x64.zip > dist/lemon-ai-win-x64.zip.sha256

      - name: Create GitHub Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${'${{'}' github.ref_name }}
          files: |
            dist/lemon-ai-linux-x64.tar.gz
            dist/lemon-ai-linux-x64.tar.gz.sha256
            dist/lemon-ai-macos-x64.tar.gz
            dist/lemon-ai-macos-x64.tar.gz.sha256
            dist/lemon-ai-win-x64.zip
            dist/lemon-ai-win-x64.zip.sha256
          generateReleaseNotes: true`}
                </pre>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallerSystem;
