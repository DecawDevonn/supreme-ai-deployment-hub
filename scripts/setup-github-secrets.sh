#!/bin/bash
# Secure GitHub Secrets Setup Script
# This script helps you configure GitHub secrets securely
# Usage: ./scripts/setup-github-secrets.sh

set -e

echo "🔐 Secure GitHub Secrets Configuration"
echo "======================================="
echo ""
echo "⚠️  IMPORTANT: Never commit actual secret values to Git!"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI. Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Function to set secret securely
set_secret() {
    local secret_name=$1
    local secret_description=$2
    
    echo "📝 Setting: $secret_name"
    echo "   Description: $secret_description"
    echo -n "   Enter value (hidden): "
    read -rs secret_value
    echo ""
    
    if [ -z "$secret_value" ]; then
        echo "   ⚠️  Skipped (empty value)"
        return
    fi
    
    if echo "$secret_value" | gh secret set "$secret_name"; then
        echo "   ✅ Set successfully"
    else
        echo "   ❌ Failed to set"
    fi
    echo ""
}

echo "🔵 Azure Configuration"
echo "----------------------"
set_secret "AZURE_CLIENT_ID" "Azure Service Principal Client ID"
set_secret "AZURE_TENANT_ID" "Azure Tenant ID"
set_secret "AZURE_SUBSCRIPTION_ID" "Azure Subscription ID"
set_secret "AZURE_CLIENT_SECRET_VALUE" "Azure Service Principal Secret"
set_secret "AZURE_STORAGE_ACCOUNT" "Azure Storage Account Name"
set_secret "AZURE_STORAGE_CONNECTION_STRING" "Azure Storage Connection String"

echo "🟠 AWS Configuration"
echo "--------------------"
set_secret "AWS_ACCESS_KEY_ID" "AWS Access Key ID"
set_secret "AWS_SECRET_ACCESS_KEY" "AWS Secret Access Key"
set_secret "AWS_REGION" "AWS Region (e.g., us-west-2)"

echo "💬 Notification Configuration"
echo "------------------------------"
set_secret "SLACK_WEBHOOK_URL" "Slack Webhook URL"
set_secret "EMAIL_USERNAME" "Email SMTP Username"
set_secret "EMAIL_PASSWORD" "Email SMTP Password"
set_secret "NOTIFICATION_EMAIL" "Notification Email Address"

echo "🗄️  Database Configuration"
echo "---------------------------"
set_secret "DB_USERNAME" "Database Username"
set_secret "DB_PASSWORD" "Database Password"
set_secret "DB_NAME" "Database Name"
set_secret "RDS_DB_PASSWORD" "RDS Database Password"

echo "☁️  GCP Configuration (Optional)"
echo "--------------------------------"
echo "For GCP credentials JSON, use: gh secret set GCP_CREDENTIALS_JSON < path/to/credentials.json"
echo ""

echo "✅ Secret configuration complete!"
echo ""
echo "🔐 Security Reminders:"
echo "   1. Never commit .env files to Git"
echo "   2. Rotate secrets regularly (every 90 days)"
echo "   3. Use different credentials for dev/staging/prod"
echo "   4. Review GitHub audit logs periodically"
echo ""
echo "📋 Verify secrets: gh secret list"
