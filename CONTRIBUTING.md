
# Contributing to Devonn.AI Chrome Extension

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. **Set up secret scanning** (see below) to prevent credential leaks.
3. If you've added code that should be tested, add tests.
4. If you've changed APIs, update the documentation.
5. Ensure the test suite passes.
6. Make sure your code lints.
7. Issue that pull request!

## Secret Scanning Setup (Required for All Contributors)

Before making your first commit, set up local secret scanning to prevent accidentally committing credentials:

### 1. Install Gitleaks

```bash
# macOS (via Homebrew)
brew install gitleaks

# Linux
wget https://github.com/gitleaks/gitleaks/releases/download/v8.18.1/gitleaks_8.18.1_linux_x64.tar.gz
tar -xzf gitleaks_8.18.1_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/

# Windows (via Chocolatey)
choco install gitleaks

# Verify installation
gitleaks version
```

### 2. Install Pre-commit Hooks

```bash
# Install dependencies (this automatically installs Husky hooks)
npm install

# Verify hooks are installed
ls -la .husky/
```

### 3. Test the Setup

```bash
# Test that secret scanning is working
echo "aws_access_key_id=AKIAIOSFODNN7EXAMPLE" > test-secret.txt
git add test-secret.txt
git commit -m "test"  # Should be blocked by pre-commit hook
rm test-secret.txt
```

### 4. Configure Secrets Properly

```bash
# Copy environment template
cp .env.example .env.local

# Never commit .env or .env.local files
# Use environment variables or AWS Secrets Manager
```

For comprehensive documentation, see:
- [Secret Scanning Setup Guide](docs/runbooks/secret_scanning_setup.md)
- [Credential Leak Migration Checklist](docs/runbooks/credential_leak_migration.md)

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the docs/ directory with any new documentation.
3. **Ensure no secrets are committed** - our CI/CD will scan for secrets automatically.
4. The PR will be merged once you have the sign-off of two other developers.

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/wesship/supreme-ai-deployment-hub/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/wesship/supreme-ai-deployment-hub/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
