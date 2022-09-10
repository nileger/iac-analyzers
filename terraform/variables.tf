variable "domain_name" {
  type    = string
  default = "iac-analyzers.dev"
}

variable "dockerhub_reg" {
  type    = string
  default = "nileger"
}

variable "dockerhub_repo" {
  type    = string
  default = "iac-analyzers"
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "github_username" {
  type = string
}

variable "github_name" {
  type    = string
  default = "IaC Analyzers Bot"
}

variable "github_email" {
  type = string
}

variable "github_api_token" {
  type = string
}

variable "github_repository" {
  type    = string
  default = "https://github.com/nileger/iac-analyzers"
}

variable "gin_mode" {
  type    = string
  default = "release"
}