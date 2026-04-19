terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.45"
    }
  }

  # Uncomment after running: terraform init -backend-config=...
  # backend "s3" {
  #   bucket         = "devonn-terraform-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "us-west-2"
  #   dynamodb_table = "devonn-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.region
}

module "network" {
  source = "../../modules/network"

  name_prefix = var.name_prefix
  cidr_block  = var.vpc_cidr
  az_count    = var.az_count
  tags        = var.tags
}

module "ecr" {
  source = "../../modules/ecr"

  name_prefix = var.name_prefix
  tags        = var.tags
}

module "eks" {
  source = "../../modules/eks"

  name_prefix      = var.name_prefix
  cluster_name     = var.cluster_name
  subnet_ids       = module.network.private_subnet_ids
  vpc_id           = module.network.vpc_id
  desired_capacity = var.node_desired
  max_capacity     = var.node_max
  min_capacity     = var.node_min
  instance_types   = var.node_instance_types
  tags             = var.tags
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ecr_repository_url" {
  value = module.ecr.repository_urls
}

output "vpc_id" {
  value = module.network.vpc_id
}
