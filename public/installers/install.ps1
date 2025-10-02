param(
  [string]$RepoOwner = "wesship",
  [string]$RepoName  = "lemon-ai",
  [string]$AssetName = "lemon-ai-win-x64.zip",
  [string]$InstallDir = "$env:ProgramFiles\LemonAI"
)

Write-Host "🔧 Lemon AI Installer (Windows - System)"

# Check for admin rights
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
  Write-Error "❌ This installer requires Administrator privileges. Please run PowerShell as Administrator."
  exit 1
}

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

$envPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
if ($envPath -notlike "*$InstallDir*") {
  Write-Host "🔗 Adding to system PATH..."
  [Environment]::SetEnvironmentVariable("Path", "$envPath;$InstallDir", [EnvironmentVariableTarget]::Machine)
}

$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut("$env:Public\Desktop\Lemon AI.lnk")
$shortcut.TargetPath = Join-Path $InstallDir "lemon-ai.exe"
$shortcut.Save()

Write-Host "✅ Installation complete!"
Write-Host "Run 'lemon-ai' from PowerShell or use the desktop shortcut"
