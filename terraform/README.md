# Inital Setup
### Terraform Cloud + GitHub Actions 
1. Register for Terraform Cloud
2. Connect with GitHub Account
3. Create organization
4. Create workspace and select repository
5. Add Digital Ocean Personal Access Token as environment variable `DIGITALOCEAN_ACCESS_TOKEN`
6. Create access token in Terraform Cloud for GitHub Actions

### GitHub Actions Configuration
1. Set `DOCKERHUB_USERNAME`
2. Set `DOCKERHUB_TOKEN`
3. Set `TF_API_TOKEN`

### Manual Todos
- In DigitalOcean, move the app to the "Static IaC Analyzers" project because currently such an assignment is not possible with Terraform.
- In Terraform cloud, create the variables `github_username`, `github_name`, `github_email`, `github_api_token`, and `github_repository`.

# Other
### Sources
- [digitalocean_app](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/app)
- [instance_size_slug options](https://www.digitalocean.com/community/questions/app-platform-instance_size_slug-options)
- [Automate Terraform with GitHub Action](https://learn.hashicorp.com/tutorials/terraform/github-actions)