# 🚨 SECURITY INCIDENT RESPONSE

## Immediate Actions Required

You've exposed production credentials. Follow these steps **immediately**:

### 1. Rotate ALL Exposed Credentials (Do This First!)

#### GitHub Token
- Go to https://github.com/settings/tokens
- Revoke token: `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`
- Generate new token with minimal required permissions

#### Azure Credentials
```bash
# Delete the compromised service principal
az ad sp delete --id 6b355a7f-e6de-441f-b0de-9bb9c0fdeb15

# Create new service principal
az ad sp create-for-rbac --name "devonn-github-actions-new" \
  --role contributor \
  --scopes /subscriptions/f52fee27-21b8-4b86-a94c-5320d8f6e768

# Rotate storage account key
az storage account keys renew \
  --account-name devonntfstatestorage \
  --key primary
```

#### AWS Credentials
```bash
# Deactivate compromised access key
aws iam delete-access-key \
  --access-key-id AKIAWYVXT23X4O3BBGU7 \
  --user-name YOUR_IAM_USERNAME

# Create new access key
aws iam create-access-key --user-name YOUR_IAM_USERNAME
```

#### Database Passwords
- Change all database passwords immediately
- Update connection strings in secure locations

### 2. Audit for Unauthorized Access

Check for suspicious activity:
```bash
# Azure activity logs
az monitor activity-log list --max-events 50

# AWS CloudTrail
aws cloudtrail lookup-events --max-results 50

# GitHub audit log
# Go to: Settings > Security > Audit log
```

### 3. Secure Going Forward

- ✅ Use the secure setup script: `./scripts/setup-github-secrets.sh`
- ✅ Enable 2FA on all accounts
- ✅ Use least-privilege IAM policies
- ✅ Implement secret rotation schedule
- ✅ Never commit credentials to Git
- ✅ Use GitHub secret scanning alerts

### 4. Monitor for Abuse

Watch for:
- Unexpected cloud resource creation
- Unusual API calls
- Billing spikes
- New deployments
- Data exfiltration

## Prevention Checklist

- [ ] All credentials rotated
- [ ] GitHub secret scanning enabled
- [ ] .env added to .gitignore
- [ ] Git history cleaned (if needed)
- [ ] Team trained on security practices
- [ ] Monitoring alerts configured
- [ ] Incident documented
- [ ] Security review completed

## Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/fundamentals/best-practices-and-patterns)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## Need Help?

If you believe credentials were actively exploited:
1. Contact your cloud provider's security team immediately
2. File incident reports
3. Consider professional security audit
4. Review compliance requirements (GDPR, SOC2, etc.)
