# Credential Leak Migration Checklist

**Internal Security Documentation**

This runbook provides step-by-step procedures for handling credential leaks and repository remediation. Follow this checklist whenever credentials or secrets have been accidentally committed to the repository.

## Table of Contents

- [Immediate Response](#immediate-response)
- [Secret Discovery and Assessment](#secret-discovery-and-assessment)
- [Credential Rotation](#credential-rotation)
- [Repository Remediation](#repository-remediation)
- [Deployment Updates](#deployment-updates)
- [Access Log Review](#access-log-review)
- [Team Communications](#team-communications)
- [Post-Incident Actions](#post-incident-actions)

---

## Immediate Response

**⚠️ Time-sensitive actions - Complete within 1 hour of discovery**

- [ ] **Stop the bleeding**: Immediately revoke or disable the exposed credentials
  - AWS: Deactivate access keys via IAM Console
  - GitHub: Revoke tokens via Settings → Developer settings
  - API Keys: Disable via respective service consoles
  - Database: Reset passwords immediately

- [ ] **Notify security team**: Email security@devonn.ai with:
  - Type of credential exposed
  - Approximate exposure time
  - Scope of potential access
  - Initial assessment of impact

- [ ] **Create incident ticket**: Open a security incident in issue tracker
  - Label: `security`, `credential-leak`, `P0`
  - Include detection method and timeline

---

## Secret Discovery and Assessment

**Goal: Identify all exposed secrets and assess impact**

### 1. Scan Repository History

Use GitHub secret scanning results:
```bash
# Via GitHub CLI
gh api repos/{owner}/{repo}/secret-scanning/alerts

# Or access via: Settings → Code security and analysis → Secret scanning
```

Run local scans with multiple tools:
```bash
# Using Gitleaks (recommended)
gitleaks detect --source . --verbose --report-format json --report-path gitleaks-report.json

# Scan entire history
gitleaks detect --source . --log-opts="--all" --verbose

# Using git-secrets
git secrets --scan-history

# Using truffleHog
trufflehog git file://. --only-verified --json
```

### 2. Document Findings

- [ ] Create a findings document with:
  - List of exposed secrets (type, commit SHA, date)
  - Services/systems affected
  - Potential access scope
  - Duration of exposure

- [ ] Determine exposure window:
  ```bash
  # Find when secret was first committed
  git log -S "EXPOSED_SECRET" --source --all
  
  # Find all commits containing the secret
  git log --all --full-history -- path/to/file
  ```

### 3. Assess Impact

- [ ] Review access logs for the exposure period (see [Access Log Review](#access-log-review))
- [ ] Identify which environments use the exposed credentials
- [ ] List all services that might have been compromised
- [ ] Document potential data exposure

---

## Credential Rotation

**Goal: Replace all exposed credentials with new ones**

### AWS Credentials

```bash
# 1. Create new access keys
aws iam create-access-key --user-name [username]

# 2. Update credentials in secure storage
aws secretsmanager update-secret \
  --secret-id devonn/[environment]/aws-credentials \
  --secret-string '{"access_key":"NEW_KEY","secret_key":"NEW_SECRET"}'

# 3. Test new credentials
aws sts get-caller-identity --profile [new-profile]

# 4. Delete old access keys
aws iam delete-access-key --user-name [username] --access-key-id [OLD_KEY]
```

### GitHub Tokens

- [ ] Navigate to Settings → Developer settings → Personal access tokens
- [ ] Delete compromised token
- [ ] Generate new token with minimal required scopes
- [ ] Update token in:
  - GitHub Actions secrets
  - CI/CD pipelines
  - Local development environments
  - Deployment scripts

### Database Credentials

```bash
# PostgreSQL example
# 1. Connect with admin credentials
psql -h [host] -U postgres

# 2. Rotate password
ALTER USER devonn_app WITH PASSWORD 'NEW_SECURE_PASSWORD';

# 3. Update in AWS Secrets Manager
aws secretsmanager update-secret \
  --secret-id devonn/[environment]/database \
  --secret-string '{"username":"devonn_app","password":"NEW_SECURE_PASSWORD"}'
```

### API Keys (Third-party services)

- [ ] **OpenAI**: Regenerate API key at platform.openai.com/api-keys
- [ ] **Hugging Face**: Regenerate at huggingface.co/settings/tokens
- [ ] **ElevenLabs**: Regenerate at elevenlabs.io/api
- [ ] **Supabase**: Rotate at project settings → API
- [ ] **Other services**: Check service-specific documentation

### Encryption Keys

- [ ] Generate new encryption keys:
  ```bash
  # Generate new 256-bit key
  openssl rand -base64 32
  ```

- [ ] Update in AWS KMS or Secrets Manager
- [ ] Re-encrypt sensitive data with new keys
- [ ] Maintain old keys temporarily for data migration

### Rotation Checklist

- [ ] All exposed credentials identified and documented
- [ ] New credentials generated for all affected services
- [ ] New credentials stored in AWS Secrets Manager
- [ ] Old credentials marked for deletion (after deployment)
- [ ] Service accounts and API keys updated

---

## Repository Remediation

**Goal: Remove secrets from Git history permanently**

### ⚠️ Warning
- Force-pushing rewrites history and affects all collaborators
- Coordinate with team before proceeding
- Consider creating a backup branch first

### Option 1: Using BFG Repo-Cleaner (Recommended)

```bash
# 1. Create fresh clone
git clone --mirror git@github.com:wesship/supreme-ai-deployment-hub.git

# 2. Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# 3. Create file with secrets to remove
cat > secrets.txt <<EOF
EXPOSED_SECRET_1
EXPOSED_SECRET_2
API_KEY_VALUE
EOF

# 4. Run BFG to remove secrets
java -jar bfg-1.14.0.jar --replace-text secrets.txt supreme-ai-deployment-hub.git

# 5. Clean up
cd supreme-ai-deployment-hub.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 6. Force push (requires coordination)
git push --force
```

### Option 2: Using git-filter-repo

```bash
# 1. Install git-filter-repo
pip install git-filter-repo

# 2. Create expressions file
cat > secret-expressions.txt <<EOF
literal:EXPOSED_SECRET_KEY
regex:sk-[a-zA-Z0-9]{48}
EOF

# 3. Filter repository
git filter-repo --replace-text secret-expressions.txt

# 4. Force push
git push --force --all
git push --force --tags
```

### Option 3: Using git filter-branch (Legacy)

```bash
# Remove file completely from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file/with/secrets" \
  --prune-empty --tag-name-filter cat -- --all

# Remove specific text patterns
git filter-branch --force --tree-filter \
  "find . -type f -exec sed -i 's/EXPOSED_SECRET/REDACTED/g' {} \;" HEAD

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force --all
git push --force --tags
```

### Post-Cleanup Verification

```bash
# Verify secrets are removed
gitleaks detect --source . --verbose

# Check specific pattern
git log --all -S "EXPOSED_SECRET"

# Verify history size reduction
du -sh .git/
```

### Team Coordination

- [ ] Notify all team members before force-push
- [ ] Provide re-clone instructions:
  ```bash
  # Save local changes
  git stash
  
  # Update remote
  git fetch origin
  git reset --hard origin/main
  
  # Restore local changes
  git stash pop
  ```

- [ ] Update protected branch rules temporarily if needed
- [ ] Verify all CI/CD pipelines work after cleanup

---

## Deployment Updates

**Goal: Update all deployments with new credentials**

### 1. Update GitHub Actions Secrets

```bash
# Via GitHub CLI
gh secret set AWS_ACCESS_KEY_ID --repo wesship/supreme-ai-deployment-hub
gh secret set AWS_SECRET_ACCESS_KEY --repo wesship/supreme-ai-deployment-hub
gh secret set OPENAI_API_KEY --repo wesship/supreme-ai-deployment-hub

# Or via UI: Settings → Secrets and variables → Actions
```

### 2. Update Kubernetes Secrets

```bash
# Update secrets in all environments
for ENV in dev staging production; do
  # Update AWS credentials
  kubectl create secret generic aws-credentials \
    --from-literal=access-key-id=NEW_KEY \
    --from-literal=secret-access-key=NEW_SECRET \
    --namespace=$ENV \
    --dry-run=client -o yaml | kubectl apply -f -
  
  # Update database credentials
  kubectl create secret generic database-credentials \
    --from-literal=username=devonn_app \
    --from-literal=password=NEW_PASSWORD \
    --namespace=$ENV \
    --dry-run=client -o yaml | kubectl apply -f -
done

# Restart deployments to pick up new secrets
kubectl rollout restart deployment/devonn-api -n production
kubectl rollout restart deployment/devonn-frontend -n production
```

### 3. Update Terraform/IaC

```bash
# Update Terraform variables
cd infrastructure/terraform

# Update secrets in terraform.tfvars (DO NOT COMMIT)
# Instead, reference from AWS Secrets Manager

# Apply changes
terraform plan -var-file=environments/production.tfvars
terraform apply -var-file=environments/production.tfvars
```

### 4. Update Container Registries

- [ ] Update credentials for Docker registries
- [ ] Re-build and push images if credentials were baked in
  ```bash
  docker build -t devonn-api:latest .
  docker push devonn-api:latest
  ```

### 5. Update Edge Functions/Serverless

```bash
# Update Supabase edge functions
supabase secrets set OPENAI_API_KEY=new_key
supabase functions deploy function-name

# Update AWS Lambda environment variables
aws lambda update-function-configuration \
  --function-name devonn-function \
  --environment Variables={API_KEY=new_value}
```

### 6. Update Development Environments

- [ ] Rotate credentials in .env.example (use placeholders)
- [ ] Update team documentation with new secret retrieval process
- [ ] Notify developers to update local .env files:
  ```bash
  # Fetch secrets from AWS Secrets Manager
  aws secretsmanager get-secret-value \
    --secret-id devonn/dev/all-secrets \
    --query SecretString --output text | jq -r 'to_entries|map("\(.key)=\(.value)")|.[]' > .env.local
  ```

### 7. Verification

- [ ] Test all deployments in staging
- [ ] Verify application functionality
- [ ] Check monitoring/alerting systems
- [ ] Perform smoke tests on critical paths
- [ ] Monitor error rates and logs

---

## Access Log Review

**Goal: Identify if exposed credentials were used maliciously**

### AWS CloudTrail

```bash
# Review access patterns for exposed credentials
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=[username] \
  --start-time [exposure-start] \
  --end-time [exposure-end] \
  --max-results 50

# Check for unusual API calls
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=CreateUser \
  --start-time [exposure-start]

# Export for detailed analysis
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=[username] \
  --start-time [exposure-start] > cloudtrail-review.json
```

### GitHub Audit Log

- [ ] Navigate to Organization Settings → Audit log
- [ ] Filter by date range: exposure window
- [ ] Look for:
  - Unauthorized token usage
  - Repository access from unknown IPs
  - Permission changes
  - Webhook additions

```bash
# Via GitHub API
gh api orgs/{org}/audit-log --paginate \
  --field per_page=100 \
  --field phrase="action:token.create OR action:repo.access"
```

### Database Access Logs

```bash
# PostgreSQL example - check pg_stat_activity
psql -h [host] -U postgres -c "
  SELECT pid, usename, client_addr, backend_start, state, query
  FROM pg_stat_activity
  WHERE backend_start BETWEEN '[start]' AND '[end]'
  ORDER BY backend_start DESC;
"

# Review RDS logs
aws rds download-db-log-file-portion \
  --db-instance-identifier devonn-postgres-production \
  --log-file-name error/postgresql.log.[date] \
  --output text
```

### Application Logs

```bash
# Review application access logs
kubectl logs -n production deployment/devonn-api \
  --since-time=[exposure-start] \
  --timestamps=true | grep -E "auth|login|unauthorized"

# Check CloudWatch logs
aws logs filter-log-events \
  --log-group-name /aws/eks/devonn/production \
  --start-time [timestamp] \
  --filter-pattern "[timestamp, request_id, level=ERROR]"
```

### Third-party Service Logs

- [ ] **OpenAI**: Check usage dashboard for unusual patterns
- [ ] **Hugging Face**: Review inference API logs
- [ ] **Supabase**: Check auth logs and database activity
- [ ] **Datadog/Monitoring**: Review unusual traffic patterns

### Analysis Checklist

- [ ] Identify all access attempts during exposure window
- [ ] Flag suspicious IPs or geolocations
- [ ] Compare access patterns to normal baseline
- [ ] Document any confirmed unauthorized access
- [ ] Preserve logs for potential incident investigation

---

## Team Communications

**Goal: Keep stakeholders informed and coordinated**

### 1. Initial Notification (Within 1 hour)

**Send to**: Engineering team, Security team, Leadership

**Template**:
```
Subject: [SECURITY] Credential Exposure Incident - Immediate Action Required

Team,

We have identified exposed credentials in our repository. Immediate actions are underway.

WHAT HAPPENED:
- Type of credentials: [AWS keys/API tokens/Database passwords]
- Exposure scope: [Public/Private repository]
- First exposed: [Commit SHA, approximate date]
- Discovered: [Date/time, method]

IMMEDIATE ACTIONS:
- [X] Credentials revoked/disabled
- [ ] Rotation in progress
- [ ] Access logs under review

REQUIRED ACTIONS FROM YOU:
- Do NOT push to repository until further notice
- Update your local credentials from AWS Secrets Manager
- Report any suspicious activity

Next update: [Time]

Security Team
```

### 2. Progress Updates (Every 2-4 hours during active incident)

**Template**:
```
Subject: [SECURITY UPDATE] Credential Incident - Progress Report

Current Status: [In Progress/Resolved]

COMPLETED:
- [X] All credentials rotated
- [X] Repository history cleaned
- [ ] Deployments updated (3/5 complete)

NEXT STEPS:
- Update remaining deployments
- Complete access log review
- Post-incident analysis

Estimated resolution: [Time]
```

### 3. Force-Push Coordination

**Send to**: All developers with repository access

**Template**:
```
Subject: [ACTION REQUIRED] Repository History Rewrite - Re-clone Required

Team,

We will force-push cleaned repository history in 30 minutes.

TIMELINE:
- Force push: [Exact time]
- Estimated downtime: 5-10 minutes

BEFORE THE PUSH:
1. Commit and push all your work NOW
2. Note your current branch: git branch --show-current
3. Stash any uncommitted changes: git stash

AFTER THE PUSH:
1. Rename your current directory: mv supreme-ai-deployment-hub supreme-ai-deployment-hub.old
2. Fresh clone: git clone git@github.com:wesship/supreme-ai-deployment-hub.git
3. Restore your work from the old directory
4. DO NOT merge/rebase from old repository

Questions? Ping in #engineering-security channel.
```

### 4. All-Clear Notification

**Template**:
```
Subject: [RESOLVED] Credential Incident - Normal Operations Resumed

Team,

The credential exposure incident has been resolved.

SUMMARY:
- Incident duration: [Duration]
- Credentials affected: [List]
- Unauthorized access detected: [Yes/No]
- Data impact: [None/Minimal/Significant]

ACTIONS COMPLETED:
- [X] All credentials rotated
- [X] Repository history cleaned
- [X] All deployments updated
- [X] Access logs reviewed
- [X] Monitoring enhanced

LESSONS LEARNED:
- [Key takeaways]
- [Process improvements]

POST-INCIDENT ACTIONS:
- Full incident report: [Link]
- Enhanced secret scanning enabled
- Team training scheduled: [Date]

Thank you for your quick response and patience.

Security Team
```

### 5. Post-Incident Report (Within 1 week)

Create a detailed report including:
- [ ] Timeline of events
- [ ] Root cause analysis
- [ ] Impact assessment
- [ ] Response effectiveness
- [ ] Preventive measures implemented
- [ ] Recommendations for future

### Communication Channels

- [ ] Email: For formal notifications and audit trail
- [ ] Slack/Teams: Real-time coordination (#engineering-security)
- [ ] Incident tracking: GitHub issue or PagerDuty
- [ ] Status page: If customer-facing services affected
- [ ] Leadership briefing: For high-severity incidents

---

## Post-Incident Actions

**Goal: Prevent future incidents and improve response**

### 1. Enable Enhanced Secret Scanning

See [Secret Scanning Setup Guide](./secret_scanning_setup.md)

- [ ] Enable GitHub secret scanning (if not already enabled)
- [ ] Configure custom secret patterns
- [ ] Set up secret scanning alerts
- [ ] Enable push protection

### 2. Implement Preventive Measures

```bash
# Add pre-commit hooks
npm install --save-dev @commitlint/cli @commitlint/config-conventional
npx husky add .husky/pre-commit "npx lint-staged"

# Add git-secrets to pre-commit
git secrets --install
git secrets --register-aws
```

Update `.lintstagedrc.json`:
```json
{
  "*": ["gitleaks protect --staged --verbose"]
}
```

### 3. Update Documentation

- [ ] Update `.env.example` with placeholders only
- [ ] Create/update secrets management documentation
- [ ] Document credential rotation procedures
- [ ] Add this checklist to team wiki/runbooks

### 4. Team Training

- [ ] Schedule security awareness training
- [ ] Review incident response procedures
- [ ] Practice secret management best practices
- [ ] Conduct tabletop exercises

### 5. Process Improvements

- [ ] Implement mandatory code review for config files
- [ ] Add automated secret detection to CI/CD
- [ ] Set up regular access audits
- [ ] Create credential rotation schedule
- [ ] Establish secret scanning SLAs

### 6. Monitoring Enhancements

- [ ] Set up alerts for new secrets in repository
- [ ] Monitor credential usage patterns
- [ ] Alert on unusual access patterns
- [ ] Regular security audit schedule

### 7. Incident Review Meeting

Schedule within 1 week of incident resolution:

**Agenda**:
- Timeline review
- What went well
- What could be improved
- Action items with owners
- Follow-up timeline

**Attendees**: Engineering team, Security team, Leadership

---

## Quick Reference

### Emergency Contacts

- Security Team: security@devonn.ai
- On-call Engineer: [PagerDuty/On-call schedule]
- Security Lead: security-lead@devonn.ai

### Critical Commands

```bash
# Scan for secrets
gitleaks detect --source . --verbose

# Rotate AWS keys
aws iam create-access-key --user-name [user]
aws iam delete-access-key --user-name [user] --access-key-id [old]

# Clean repository
java -jar bfg.jar --replace-text secrets.txt repo.git

# Update Kubernetes secrets
kubectl create secret generic [name] --from-literal=key=value --dry-run=client -o yaml | kubectl apply -f -

# Review CloudTrail
aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=[user]
```

### Related Documentation

- [Secret Scanning Setup Guide](./secret_scanning_setup.md)
- [SECURITY.md](../../SECURITY.md)
- [Operational Procedures](../OPERATIONAL_PROCEDURES.md)
- [Disaster Recovery Plan](../DISASTER_RECOVERY_PLAN.md)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-26 | Security Team | Initial creation |

---

**Remember**: Speed is critical in credential leak incidents. Follow this checklist systematically, but don't hesitate to escalate if you're unsure about any step.
