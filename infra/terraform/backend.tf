terraform {
  backend "s3" {
    # Bucket name will be provided via backend-config during init
    # terraform init -backend-config="bucket=YOUR_BUCKET_NAME"
    key            = "devonn-ai-studio/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "devonn-ai-studio-terraform-locks"
  }
}
