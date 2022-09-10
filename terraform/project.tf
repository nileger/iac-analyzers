resource "digitalocean_project" "static_iac_analyzers" {
  name        = "Static IaC Analyzers"
  description = "Decision Guide For Static IaC Analyzers"
  purpose     = "Class project / Educational purposes"
  environment = "Production"
  resources = [
    digitalocean_domain.domain.urn
  ]
}
