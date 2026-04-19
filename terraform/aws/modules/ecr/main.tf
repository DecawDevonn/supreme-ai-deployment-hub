################################################################################
# ECR Repository
# Live: 211125423223.dkr.ecr.us-west-2.amazonaws.com/production/devonn-ai
################################################################################

resource "aws_ecr_repository" "devonn_ai" {
  name                 = "production/devonn-ai"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.tags
}

################################################################################
# Outputs
################################################################################

output "repository_urls" {
  value = {
    devonn_ai = aws_ecr_repository.devonn_ai.repository_url
  }
}

output "repository_arn" {
  value = aws_ecr_repository.devonn_ai.arn
}
