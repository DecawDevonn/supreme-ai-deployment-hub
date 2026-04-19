#!/usr/bin/env bash
# =============================================================================
# Terraform Import Script — Devonn AI Prod (us-west-2)
# Account: 211125423223
# Run from: terraform/aws/environments/prod/
# Prereqs: terraform init, AWS credentials configured
# =============================================================================
set -euo pipefail

echo "=== Initializing Terraform ==="
terraform init

echo ""
echo "=== Importing EKS Cluster ==="
terraform import module.eks.aws_eks_cluster.this devonn-eks-prod

echo ""
echo "=== Importing Cluster IAM Role ==="
terraform import module.eks.aws_iam_role.cluster \
  devonn-eks-prod-cluster-20251110070008631600000002

echo ""
echo "=== Importing Node Group IAM Role ==="
terraform import module.eks.aws_iam_role.node_group \
  dev_nodes-eks-node-group-20251110070005836700000001

echo ""
echo "=== Importing Launch Template ==="
terraform import module.eks.aws_launch_template.node_group lt-0e4fdaa0ec426cc21

echo ""
echo "=== Importing EKS Node Group ==="
terraform import module.eks.aws_eks_node_group.this \
  devonn-eks-prod:devonn-nodes-v2

echo ""
echo "=== Importing ECR Repository ==="
terraform import module.ecr.aws_ecr_repository.devonn_ai production/devonn-ai

echo ""
echo "=== Importing VPC ==="
terraform import module.network.aws_vpc.this vpc-07efb80f704d0f144

echo ""
echo "=== Importing Private Subnets ==="
terraform import "module.network.aws_subnet.private[0]" subnet-0db4ec070ec994d0e
terraform import "module.network.aws_subnet.private[1]" subnet-07a4cb21c1445d536

echo ""
echo "=== Import complete. Running terraform plan to check drift ==="
terraform plan -out=tfplan

echo ""
echo "Review the plan above. If it shows no changes, state is fully reconciled."
echo "To apply any corrections: terraform apply tfplan"
