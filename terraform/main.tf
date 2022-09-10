terraform {
  required_version = ">= 1.0.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  cloud {
    organization = "iac-analyzers"

    workspaces {
      name = "iac-analyzers"
    }
  }
}

provider "digitalocean" {}
