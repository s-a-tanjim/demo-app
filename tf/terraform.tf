terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.57"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.10"
    }
  }
  

  required_version = ">= 1.0"

  backend "s3" {
    bucket         = "demo-app-tf-bucket"
    key            = "statefile.tfstate"
    region         = "us-east-1"

    endpoints = {
      s3 = "https://s3-endpoint.amazonaws.com"
    }
  }
}