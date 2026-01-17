
// Common configuration elements for Terraform AWS deployment
export const commonConfigYaml = `# --- Common Terraform Configuration ---
# Terraform configuration for setting up AWS infrastructure
#
# Usage:
# 1) terraform init -backend-config=environments/\${ENV:-prod}.backend.hcl
# 2) terraform plan -out=tfplan -var-file="environments/\${ENV:-prod}.tfvars"
# 3) terraform apply tfplan
#
# NOTE:
# Terraform backends do NOT support variables. That's why backend config is passed via -backend-config.

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }

  backend "s3" {
    # Values are provided via -backend-config (see environments/*.backend.hcl)
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      ManagedBy   = "Terraform"
      Project     = "DevonnAI"
      Environment = var.environment
    }
  }
}

variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Environment name (dev|staging|prod)"
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod"
  }
}
`;
