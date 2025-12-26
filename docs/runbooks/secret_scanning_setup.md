# Secret Scanning Setup and Configuration Guide

**Automated Secret Detection Tools and Best Practices**

This guide describes how to verify, enable, and configure automated secret scanning tools for the Devonn.AI repository. Following these procedures helps prevent credential leaks and ensures early detection of accidentally committed secrets.

## Table of Contents

- [Overview](#overview)
- [GitHub Secret Scanning](#github-secret-scanning)
- [Gitleaks Configuration](#gitleaks-configuration)
- [CodeQL Security Analysis](#codeql-security-analysis)
- [Pre-commit Hooks](#pre-commit-hooks)
- [CI/CD Integration](#cicd-integration)
- [Custom Secret Patterns](#custom-secret-patterns)
- [Alert Management](#alert-management)
- [Best Practices](#best-practices)

---

## Overview

### Automated Tools in Use

| Tool | Purpose | Scope | Status |
|------|---------|-------|--------|
| **GitHub Secret Scanning** | Detect known secret patterns | Repository history & new commits | ✅ Recommended |
| **GitHub Push Protection** | Block commits with secrets | Pre-push validation | ✅ Recommended |
| **Gitleaks** | Comprehensive secret detection | Local & CI/CD | ✅ Configured |
| **CodeQL** | Security vulnerability analysis | Code analysis in CI | ✅ Active |
| **git-secrets** | AWS credential detection | Pre-commit hooks | ⚠️ Optional |
| **pre-commit hooks** | Local validation | Developer workstations | ✅ Configured |

### Detection Coverage

Our secret scanning setup detects:
- AWS access keys and secret keys
- API tokens (GitHub, OpenAI, Hugging Face, etc.)
- Database connection strings
- Private SSH keys
- OAuth tokens and client secrets
- JWT secrets
- Encryption keys
- Generic high-entropy strings

---

## GitHub Secret Scanning

GitHub provides built-in secret scanning for repositories. This is the **primary defense** against credential leaks.

### Enabling GitHub Secret Scanning

#### For Public Repositories

Secret scanning is **automatically enabled** for public repositories.

To verify:

1. Navigate to repository: https://github.com/wesship/supreme-ai-deployment-hub
2. Go to **Settings** → **Code security and analysis**
3. Verify status:
   - ✅ **Secret scanning**: Enabled (cannot be disabled for public repos)
   - ✅ **Push protection**: Enable if not active

#### For Private Repositories

If the repository is private, enable secret scanning:

1. Go to **Settings** → **Code security and analysis**
2. Under **Secret scanning**:
   - Click **Enable** for secret scanning
   - Click **Enable** for push protection
3. Configure **Secret scanning alerts**:
   - Enable email notifications
   - Set up webhook integrations (optional)

#### Via GitHub CLI

```bash
# Check current secret scanning status
gh api repos/wesship/supreme-ai-deployment-hub \
  --jq '.security_and_analysis'

# Enable secret scanning for private repo (requires admin access)
gh api -X PATCH repos/wesship/supreme-ai-deployment-hub \
  -f security_and_analysis='{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}'
```

#### Via GitHub API

```bash
# Enable secret scanning
curl -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/wesship/supreme-ai-deployment-hub \
  -d '{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}'
```

### Configuring Push Protection

Push protection prevents commits containing secrets from being pushed to the repository.

**To enable**:
1. Settings → Code security and analysis
2. Secret scanning → **Push protection**
3. Click **Enable**

**Behavior**:
- Blocks pushes containing detected secrets
- Provides immediate feedback to developers
- Allows bypass with justification (logged)

**Bypass procedure** (use only when absolutely necessary):
```bash
# Developer receives blocked push error
# Review the secret pattern detected
# If it's a false positive, you can bypass:
git push --push-option=secret-scanning-bypass

# Or via web interface with justification
```

### Viewing Secret Scanning Alerts

#### Via Web Interface

1. Go to repository **Security** tab
2. Click **Secret scanning alerts**
3. Review each alert:
   - Alert type (AWS key, API token, etc.)
   - Location (file, line, commit)
   - Exposure status (public/private)
   - State (open/resolved)

#### Via GitHub CLI

```bash
# List all secret scanning alerts
gh api repos/wesship/supreme-ai-deployment-hub/secret-scanning/alerts \
  --jq '.[] | {number, state, secret_type, created_at, html_url}'

# Get specific alert details
gh api repos/wesship/supreme-ai-deployment-hub/secret-scanning/alerts/1

# Filter by state
gh api repos/wesship/supreme-ai-deployment-hub/secret-scanning/alerts \
  --field state=open \
  --jq '.[] | {number, secret_type, created_at}'
```

#### Alert Response Workflow

When an alert is triggered:

1. **Review immediately**: Check alert details and affected files
2. **Verify authenticity**: Confirm it's a real secret (not a false positive)
3. **Assess impact**: Determine if the secret is active/exposed
4. **Follow remediation**: Use [Credential Leak Migration Checklist](./credential_leak_migration.md)
5. **Resolve alert**: Mark as resolved with reason:
   - `false_positive`: Not a real secret
   - `revoked`: Secret has been rotated
   - `wont_fix`: Accepted risk (document why)
   - `used_in_tests`: Test/dummy data

```bash
# Close an alert as revoked
gh api -X PATCH repos/wesship/supreme-ai-deployment-hub/secret-scanning/alerts/1 \
  -f state=resolved \
  -f resolution=revoked \
  -f resolution_comment="Secret rotated and removed from history"
```

### Custom Patterns (GitHub Advanced Security)

**Note**: Custom patterns require GitHub Advanced Security (available for public repos and GitHub Enterprise).

To add custom patterns:

1. Settings → Code security and analysis → Secret scanning
2. Click **New pattern**
3. Configure:
   - **Name**: Pattern identifier (e.g., "Devonn API Key")
   - **Secret format**: Regular expression
   - **Test string**: Example to validate pattern
   - **Before secret**: Context pattern (optional)
   - **After secret**: Context pattern (optional)

**Example custom patterns**:

```regex
# Devonn API Key format: devonn_[a-z0-9]{32}
devonn_[a-z0-9]{32}

# JWT secret (high entropy)
[jJ][wW][tT]_[a-zA-Z0-9_-]{40,}

# Supabase anon key
eyJ[a-zA-Z0-9_-]{20,}\.eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}

# Custom encryption key format
ENC_KEY_[A-Z0-9]{64}
```

---

## Gitleaks Configuration

Gitleaks is a comprehensive SAST tool for detecting hardcoded secrets. It's faster and more configurable than git-secrets.

### Installation

#### Local Installation

```bash
# macOS (via Homebrew)
brew install gitleaks

# Linux (via package manager)
wget https://github.com/gitleaks/gitleaks/releases/download/v8.18.1/gitleaks_8.18.1_linux_x64.tar.gz
tar -xzf gitleaks_8.18.1_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/

# Windows (via Chocolatey)
choco install gitleaks

# Verify installation
gitleaks version
```

#### Docker

```bash
docker pull zricethezav/gitleaks:latest

# Run scan
docker run -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path" -v
```

### Configuration File

Create `.gitleaks.toml` in repository root:

```toml
title = "Devonn.AI Gitleaks Configuration"

[extend]
# Use default gitleaks rules
useDefault = true

[[rules]]
id = "devonn-api-key"
description = "Detected Devonn API Key"
regex = '''devonn_[a-z0-9]{32}'''
tags = ["key", "devonn"]

[[rules]]
id = "jwt-secret"
description = "Detected JWT Secret"
regex = '''(?i)jwt[_-]?secret[_-]?(?:key)?[_-]?(?:=|:)[_-]?[\"']?([a-zA-Z0-9_-]{40,})[\"']?'''
tags = ["jwt", "secret"]

[[rules]]
id = "openai-api-key"
description = "OpenAI API Key"
regex = '''sk-[a-zA-Z0-9]{48}'''
tags = ["api-key", "openai"]

[[rules]]
id = "huggingface-token"
description = "Hugging Face Token"
regex = '''hf_[a-zA-Z0-9]{32,}'''
tags = ["api-key", "huggingface"]

[[rules]]
id = "elevenlabs-api-key"
description = "ElevenLabs API Key"
regex = '''[0-9a-f]{32}'''
tags = ["api-key", "elevenlabs"]
# Note: This pattern is broad; requires path context to reduce false positives
[rules.allowlist]
paths = [
  '''node_modules/''',
  '''package-lock.json''',
  '''bun.lockb''',
  '''dist/''',
  '''build/'''
]

[[rules]]
id = "aws-access-key"
description = "AWS Access Key ID"
regex = '''(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'''
tags = ["aws", "access-key"]

[[rules]]
id = "generic-high-entropy"
description = "Generic high-entropy string (potential secret)"
regex = '''[a-zA-Z0-9+/]{40,}={0,2}'''
entropy = 5.0
tags = ["entropy"]

# Allowlist for known false positives
[allowlist]
description = "Allowlisted files and patterns"
paths = [
  '''.git/''',
  '''node_modules/''',
  '''dist/''',
  '''build/''',
  '''*.test.ts''',
  '''*.test.js''',
  '''test-fixtures/''',
  '''.env.example''',
  '''README.md''',
  '''docs/'''
]

regexes = [
  # Example placeholders
  '''(?i)example''',
  '''(?i)placeholder''',
  '''(?i)your[-_]?api[-_]?key[-_]?here''',
  '''(?i)replace[-_]?with''',
  '''(?i)dummy''',
  '''(?i)test[-_]?key''',
  # Base64 encoded test strings
  '''VGVzdFN0cmluZw==''',
]

# Specific commits to ignore (after verified remediation)
commits = [
  # Add commit SHAs that were cleaned/verified
]
```

### Running Gitleaks

#### Detect Secrets in Current State

```bash
# Scan current files (not history)
gitleaks detect --source . --verbose

# Scan with custom config
gitleaks detect --source . --config .gitleaks.toml --verbose

# Generate report
gitleaks detect --source . --report-format json --report-path gitleaks-report.json

# Scan specific path
gitleaks detect --source ./src --verbose
```

#### Scan Entire Git History

```bash
# Scan all commits
gitleaks detect --source . --log-opts="--all" --verbose

# Scan specific branch
gitleaks detect --source . --log-opts="main" --verbose

# Scan commit range
gitleaks detect --source . --log-opts="commit1..commit2" --verbose
```

#### Protect Mode (Pre-commit)

```bash
# Scan staged changes only
gitleaks protect --staged --verbose

# Use in pre-commit hook
gitleaks protect --staged --redact --verbose
```

#### Baseline for Existing Secrets

If repository has known secrets (documented/accepted):

```bash
# Generate baseline file
gitleaks detect --source . --report-format json --report-path .gitleaks-baseline.json

# Scan ignoring baseline
gitleaks detect --source . --baseline-path .gitleaks-baseline.json --verbose
```

### Understanding Results

Gitleaks output includes:

```json
{
  "Description": "AWS Access Key ID",
  "StartLine": 42,
  "EndLine": 42,
  "StartColumn": 15,
  "EndColumn": 51,
  "Match": "AKIAIOSFODNN7EXAMPLE",
  "Secret": "AKIAIOSFODNN7EXAMPLE",
  "File": "src/config/aws.ts",
  "Commit": "a1b2c3d4e5f6",
  "Entropy": 3.8,
  "Author": "developer@example.com",
  "Date": "2025-12-26T10:30:00Z",
  "Message": "Add AWS configuration",
  "Tags": ["aws", "access-key"],
  "RuleID": "aws-access-key"
}
```

**Response**:
1. Verify if it's a real secret
2. If yes, follow [credential rotation procedure](./credential_leak_migration.md)
3. If false positive, add to allowlist in `.gitleaks.toml`

---

## CodeQL Security Analysis

CodeQL is already configured in the repository via `.github/workflows/testing.yml`.

### Current Configuration

```yaml
# From testing.yml
security-scan:
  name: Security Scan
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    
    - name: Run CodeQL Analysis
      uses: github/codeql-action/analyze@v2
      continue-on-error: true
```

### Enhanced CodeQL Configuration

Create `.github/workflows/codeql.yml` for dedicated security scanning:

```yaml
name: "CodeQL Security Analysis"

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly scan on Mondays at 2 AM

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript', 'typescript', 'python' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: ${{ matrix.language }}
        queries: security-extended,security-and-quality

    - name: Autobuild
      uses: github/codeql-action/autobuild@v2

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
      with:
        category: "/language:${{matrix.language}}"
```

### Viewing CodeQL Results

1. Navigate to repository **Security** tab
2. Click **Code scanning alerts**
3. Filter by:
   - Severity (Critical, High, Medium, Low)
   - Tool (CodeQL)
   - State (Open, Dismissed, Closed)

```bash
# Via GitHub CLI
gh api repos/wesship/supreme-ai-deployment-hub/code-scanning/alerts \
  --jq '.[] | {number, rule, severity, state, created_at}'

# Get specific alert
gh api repos/wesship/supreme-ai-deployment-hub/code-scanning/alerts/1
```

### Custom CodeQL Queries

Create `.github/codeql/custom-queries.ql`:

```ql
/**
 * @name Hardcoded credentials
 * @description Detects potential hardcoded credentials in code
 * @kind problem
 * @problem.severity error
 * @id js/hardcoded-credentials
 */

import javascript

from StringLiteral str
where
  str.getValue().regexpMatch("(?i).*(password|secret|api[_-]?key|token).*") and
  str.getValue().length() > 20
select str, "Potential hardcoded credential detected"
```

---

## Pre-commit Hooks

Pre-commit hooks prevent secrets from being committed locally.

### Setup with Husky

The repository already uses Husky for git hooks.

**Enhance `.husky/pre-commit`**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run Gitleaks on staged files
echo "🔍 Scanning for secrets..."
gitleaks protect --staged --redact --verbose

if [ $? -ne 0 ]; then
  echo "❌ Secret detected! Commit blocked."
  echo "Review the findings above and remove secrets before committing."
  exit 1
fi

# Run existing lint-staged
npx lint-staged
```

### Setup with pre-commit Framework

Alternatively, use the pre-commit framework:

**Create `.pre-commit-config.yaml`**:

```yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.1
    hooks:
      - id: gitleaks

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: check-merge-conflict
      - id: detect-private-key
      - id: end-of-file-fixer
      - id: trailing-whitespace

  - repo: local
    hooks:
      - id: no-commit-to-main
        name: Don't commit to main
        entry: bash -c 'if [ "$(git branch --show-current)" = "main" ]; then echo "Cannot commit directly to main!"; exit 1; fi'
        language: system
        pass_filenames: false
```

**Install**:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

### Developer Setup Instructions

Add to **README.md** or **CONTRIBUTING.md**:

```markdown
## Secret Scanning Setup for Developers

Before making your first commit:

1. Install Gitleaks:
   ```bash
   brew install gitleaks  # macOS
   # or see https://github.com/gitleaks/gitleaks#installation
   ```

2. Verify pre-commit hooks:
   ```bash
   npm install  # Installs Husky hooks automatically
   ```

3. Test the setup:
   ```bash
   echo "aws_access_key_id=AKIAIOSFODNN7EXAMPLE" > test-secret.txt
   git add test-secret.txt
   git commit -m "test"  # Should be blocked
   rm test-secret.txt
   ```

4. Configure local secrets management:
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Fetch secrets from AWS Secrets Manager
   aws secretsmanager get-secret-value \
     --secret-id devonn/dev/all-secrets \
     --query SecretString --output text | jq -r 'to_entries|map("\(.key)=\(.value)")|.[]' > .env.local
   ```
```

---

## CI/CD Integration

### GitHub Actions Workflow for Gitleaks

Create `.github/workflows/secret-scanning.yml`:

```yaml
name: Secret Scanning

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    # Run weekly full scan
    - cron: '0 3 * * 0'

jobs:
  gitleaks:
    name: Gitleaks Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for comprehensive scan

      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}  # Optional, for Gitleaks Pro
        with:
          config-path: .gitleaks.toml

      - name: Upload Gitleaks Report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: gitleaks-report
          path: gitleaks-report.json

  trufflehog:
    name: TruffleHog Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: TruffleHog OSS
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --only-verified

  secret-scan-summary:
    name: Secret Scan Summary
    runs-on: ubuntu-latest
    needs: [gitleaks, trufflehog]
    if: always()
    steps:
      - name: Check scan results
        run: |
          if [ "${{ needs.gitleaks.result }}" == "failure" ] || [ "${{ needs.trufflehog.result }}" == "failure" ]; then
            echo "⚠️ Secret scanning detected potential issues!"
            echo "Review the scan results and take appropriate action."
            exit 1
          else
            echo "✅ No secrets detected"
          fi
```

### Integration with Testing Workflow

Update `.github/workflows/testing.yml` to include Gitleaks:

```yaml
security-scan:
  name: Security Scan
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    
    - name: Run Gitleaks
      uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Run npm audit
      run: npm audit --production
      continue-on-error: true
    
    - name: Run CodeQL Analysis
      uses: github/codeql-action/analyze@v2
      continue-on-error: true
```

---

## Custom Secret Patterns

### Adding Organization-Specific Patterns

Document patterns specific to Devonn.AI:

**In `.gitleaks.toml`**:

```toml
[[rules]]
id = "devonn-internal-api-key"
description = "Devonn Internal API Key"
regex = '''(?i)devonn[_-]?(?:api)?[_-]?key[_-]?[:=]\s*['""]?([a-z0-9_-]{32,})['""]?'''
tags = ["devonn", "api-key"]
entropy = 3.5

[[rules]]
id = "supabase-service-role"
description = "Supabase Service Role Key"
regex = '''eyJ[a-zA-Z0-9_-]{20,}\.eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}'''
tags = ["supabase", "jwt", "service-role"]

[[rules]]
id = "terraform-sensitive-output"
description = "Terraform sensitive output in code"
regex = '''(?i)terraform\s+output.*sensitive.*=\s*true'''
tags = ["terraform", "sensitive"]

[[rules]]
id = "database-connection-string"
description = "Database connection string"
regex = '''(?i)(postgres|mysql|mongodb):\/\/[a-z0-9_-]+:[a-z0-9_-]+@[a-z0-9.-]+:[0-9]+\/[a-z0-9_-]+'''
tags = ["database", "connection-string"]
```

### Pattern Testing

Test patterns before deployment:

```bash
# Test against sample strings
echo "devonn_api_key=abc123def456ghi789jkl012mno345pq" | gitleaks detect --no-git --verbose

# Test configuration
gitleaks detect --config .gitleaks.toml --source . --verbose --redact
```

---

## Alert Management

### Notification Setup

#### GitHub Email Notifications

1. Navigate to repository **Settings**
2. Go to **Notifications**
3. Enable:
   - ✅ Security alerts
   - ✅ Secret scanning alerts

#### Slack/Teams Integration

**Using GitHub webhooks**:

1. Settings → Webhooks → Add webhook
2. Payload URL: [Your Slack webhook URL]
3. Content type: `application/json`
4. Events: Select "Security alerts"

**Example Slack notification payload**:

```json
{
  "text": "🚨 Secret Detected in Repository",
  "attachments": [{
    "color": "danger",
    "fields": [
      {"title": "Repository", "value": "wesship/supreme-ai-deployment-hub", "short": true},
      {"title": "Alert Type", "value": "AWS Access Key", "short": true},
      {"title": "File", "value": "src/config/aws.ts", "short": false},
      {"title": "Action Required", "value": "Review and rotate credentials immediately", "short": false}
    ]
  }]
}
```

#### Email Alerts for Critical Patterns

Configure email notifications for specific secret types in your CI/CD:

```yaml
# In .github/workflows/secret-scanning.yml
- name: Send alert for critical secrets
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.MAIL_USERNAME }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: 🚨 Critical Secret Detected in ${{ github.repository }}
    to: security@devonn.ai
    from: github-security@devonn.ai
    body: |
      A critical secret has been detected in the repository.
      
      Repository: ${{ github.repository }}
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
      
      Please review immediately: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

### Alert Triage Process

When an alert is received:

1. **Immediate (< 15 min)**:
   - [ ] Acknowledge alert
   - [ ] Verify if secret is real
   - [ ] Assess severity and exposure

2. **Short-term (< 1 hour)**:
   - [ ] Rotate credentials if real
   - [ ] Follow [credential leak checklist](./credential_leak_migration.md)
   - [ ] Update affected systems

3. **Follow-up (< 24 hours)**:
   - [ ] Clean repository history
   - [ ] Review access logs
   - [ ] Document incident
   - [ ] Close alert with resolution

### False Positive Management

Track and document false positives:

**Create `docs/security/false-positives.md`**:

```markdown
# Secret Scanning False Positives

## Documented False Positives

| Pattern | File | Reason | Added By | Date |
|---------|------|--------|----------|------|
| `test_key_123...` | tests/fixtures/keys.ts | Test fixture | @developer | 2025-12-26 |
| `EXAMPLE_AWS_KEY` | README.md | Documentation example | @developer | 2025-12-26 |
```

**Update `.gitleaks.toml` allowlist**:

```toml
[allowlist]
regexes = [
  '''test_key_123[a-z0-9]{20}''',
  '''EXAMPLE_AWS_KEY'''
]
```

---

## Best Practices

### For Developers

1. **Never commit secrets**:
   - Use environment variables
   - Use AWS Secrets Manager
   - Reference secrets, don't embed them

2. **Use `.env.example` for templates**:
   ```bash
   # .env.example (committed)
   OPENAI_API_KEY=your_openai_key_here
   DATABASE_URL=postgresql://user:password@localhost:5432/db
   
   # .env (gitignored, not committed)
   OPENAI_API_KEY=sk-actual-secret-key
   DATABASE_URL=postgresql://actual:password@prod.example.com:5432/proddb
   ```

3. **Test before committing**:
   ```bash
   # Quick scan before commit
   gitleaks protect --staged --verbose
   ```

4. **Use secret references in code**:
   ```typescript
   // ❌ DON'T
   const apiKey = "sk-abcd1234efgh5678ijkl";
   
   // ✅ DO
   const apiKey = process.env.OPENAI_API_KEY;
   ```

### For Reviewers

1. **Check for secrets in PR**:
   - Review environment files
   - Check configuration changes
   - Verify secret references vs. values

2. **Use GitHub's secret scanning on PRs**:
   - Secret scanning runs automatically
   - Check Security tab for alerts
   - Don't merge if secrets detected

3. **Verify pre-commit hooks**:
   - Ensure contributors have hooks installed
   - Test that hooks are working

### For Operations

1. **Regular audits**:
   ```bash
   # Weekly full repository scan
   gitleaks detect --source . --log-opts="--all" --verbose
   ```

2. **Monitor alert trends**:
   - Track alert frequency
   - Identify common patterns
   - Improve education/tooling

3. **Keep tools updated**:
   ```bash
   # Update Gitleaks
   brew upgrade gitleaks
   
   # Update pre-commit hooks
   pre-commit autoupdate
   ```

4. **Test secret rotation**:
   - Practice rotation procedures quarterly
   - Verify automated rotation works
   - Update runbooks based on learnings

---

## Troubleshooting

### Gitleaks Issues

**Issue**: Gitleaks reports false positives

**Solution**:
```bash
# Add to allowlist in .gitleaks.toml
[allowlist]
regexes = ['''false_positive_pattern''']

# Or use baseline
gitleaks detect --source . --report-format json --report-path .gitleaks-baseline.json
```

**Issue**: Pre-commit hook not running

**Solution**:
```bash
# Reinstall hooks
rm -rf .git/hooks
npx husky install

# Or with pre-commit framework
pre-commit uninstall
pre-commit install
```

**Issue**: Gitleaks too slow on large repository

**Solution**:
```bash
# Scan only recent commits
gitleaks detect --source . --log-opts="-n 100" --verbose

# Scan specific paths
gitleaks detect --source ./src --verbose

# Use parallel scanning
gitleaks detect --source . --threads 8
```

### GitHub Secret Scanning Issues

**Issue**: Secret scanning not enabled

**Solution**:
- For public repos: Enabled by default, check Settings
- For private repos: Requires GitHub Advanced Security
- Contact GitHub support if issues persist

**Issue**: Push protection blocking valid commits

**Solution**:
```bash
# Bypass with justification (logged)
git push --push-option=secret-scanning-bypass

# Or remove the pattern from commit
git reset HEAD~1
# Edit files to remove secret
git add .
git commit -m "Fixed secret issue"
git push
```

---

## Quick Reference

### Commands Cheat Sheet

```bash
# Gitleaks
gitleaks detect --source . --verbose                          # Scan current state
gitleaks protect --staged --verbose                           # Scan staged files
gitleaks detect --source . --log-opts="--all" --verbose      # Scan full history

# GitHub CLI - Secret scanning
gh api repos/{owner}/{repo}/secret-scanning/alerts           # List alerts
gh api repos/{owner}/{repo}/secret-scanning/alerts/1         # Get alert details

# GitHub CLI - CodeQL
gh api repos/{owner}/{repo}/code-scanning/alerts             # List alerts

# Pre-commit
pre-commit run --all-files                                    # Run all hooks
pre-commit run gitleaks --all-files                           # Run specific hook
```

### Configuration Files Checklist

- [ ] `.gitleaks.toml` - Gitleaks configuration
- [ ] `.pre-commit-config.yaml` - Pre-commit hooks (optional)
- [ ] `.husky/pre-commit` - Husky pre-commit hook
- [ ] `.github/workflows/secret-scanning.yml` - CI/CD scanning
- [ ] `.env.example` - Environment template
- [ ] `.gitignore` - Includes `.env`, `.env.local`, etc.

### Related Documentation

- [Credential Leak Migration Checklist](./credential_leak_migration.md)
- [SECURITY.md](../../SECURITY.md)
- [GitHub Secret Scanning Docs](https://docs.github.com/en/code-security/secret-scanning)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [CodeQL Documentation](https://codeql.github.com/docs/)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-26 | Security Team | Initial creation |

---

**Remember**: Secret scanning is only effective if properly configured and monitored. Regularly review and update patterns, respond promptly to alerts, and educate the team on best practices.
