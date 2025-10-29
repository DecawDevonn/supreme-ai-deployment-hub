# Secure Deployment Guide

## 🔐 Security-First Approach

This guide ensures your deployment is secure from the start.

## Prerequisites

- [ ] GitHub account with 2FA enabled
- [ ] GitHub CLI installed (`gh --version`)
- [ ] Cloud provider accounts (Azure/AWS)
- [ ] All credentials stored securely (password manager)

## Step 1: Secure Your Repository

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore

# Commit .gitignore
git add .gitignore
git commit -m "security: ensure .env files are ignored"

# Enable GitHub secret scanning
# Go to: Settings > Code security and analysis > Enable all features
```

## Step 2: Set Up Credentials Securely

```bash
# Make script executable
chmod +x scripts/setup-github-secrets.sh

# Run the secure setup script
./scripts/setup-github-secrets.sh
```

The script will prompt you for each credential securely (input is hidden).

## Step 3: Verify Secret Configuration

```bash
# List configured secrets (values are hidden)
gh secret list

# Should show:
# AZURE_CLIENT_ID
# AZURE_TENANT_ID
# AZURE_SUBSCRIPTION_ID
# AZURE_CLIENT_SECRET_VALUE
# AZURE_STORAGE_ACCOUNT
# AZURE_STORAGE_CONNECTION_STRING
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_REGION
# DB_USERNAME
# DB_PASSWORD
# (and others)
```

## Step 4: Configure Deployment Workflow

Your `.github/workflows/deploy.yml` is already configured to use these secrets securely.

## Step 5: Test Deployment

```bash
# Deploy to staging first
git checkout -b test-deployment
git push origin test-deployment

# Monitor the workflow
gh workflow view deploy
gh run watch
```

## Security Best Practices

### ✅ DO

- Use GitHub OIDC for AWS/Azure (no static credentials)
- Enable branch protection on `main`
- Require PR reviews for production deployments
- Use environment-specific secrets (dev/staging/prod)
- Rotate credentials every 90 days
- Enable audit logging
- Use least-privilege IAM policies
- Scan dependencies for vulnerabilities

### ❌ DON'T

- Commit `.env` files to Git
- Share credentials in chat/email/Slack
- Use production credentials in development
- Give blanket admin permissions
- Reuse passwords across services
- Disable security features for convenience
- Ignore security warnings

## Credential Rotation Schedule

| Credential Type | Rotation Frequency |
|----------------|-------------------|
| GitHub Tokens | 90 days |
| Cloud Provider Keys | 90 days |
| Database Passwords | 60 days |
| API Keys | 90 days |
| Service Principal Secrets | 90 days |

## Monitoring & Alerts

Set up alerts for:
- Failed authentication attempts
- Unusual API usage
- Billing anomalies
- New resource creation
- Permission changes
- Secrets accessed

## Incident Response

If credentials are compromised:
1. Read `SECURITY-INCIDENT.md`
2. Rotate ALL affected credentials immediately
3. Audit logs for unauthorized access
4. Notify stakeholders
5. Document the incident
6. Review and improve security practices

## Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/)
- [AWS Security Hub](https://aws.amazon.com/security-hub/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Support

For security concerns:
- Open a private security advisory on GitHub
- Contact your security team
- Review incident response procedures
