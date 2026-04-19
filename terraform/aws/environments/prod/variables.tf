variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "name_prefix" {
  description = "Prefix for all resource names"
  type        = string
  default     = "devonn-vpc-prod"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "devonn-eks-prod"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "az_count" {
  description = "Number of availability zones"
  type        = number
  default     = 2
}

variable "node_desired" {
  description = "Desired number of EKS nodes"
  type        = number
  default     = 2
}

variable "node_min" {
  description = "Minimum number of EKS nodes"
  type        = number
  default     = 1
}

variable "node_max" {
  description = "Maximum number of EKS nodes"
  type        = number
  default     = 3
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS nodes"
  type        = list(string)
  default     = ["t3.small"]
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "prod"
    ManagedBy   = "terraform"
    Project     = "devonn-ai"
    Stack       = "supreme-ai-deployment-hub"
  }
}
