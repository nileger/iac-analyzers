resource "digitalocean_app" "sica-decision-guide" {
  spec {
    name   = "sica-decision-guide"
    region = "fra1"

    domain {
      name = var.domain_name
      type = "PRIMARY"
      zone = var.domain_name
    }

    alert {
      rule = "DEPLOYMENT_FAILED"
    }

    service {
      name               = "sica-decision-guide-service"
      instance_count     = 1
      instance_size_slug = "basic-xxs"

      health_check {
        http_path             = "/api/health"
        initial_delay_seconds = 30
        period_seconds        = 60
      }

      alert {
        rule     = "CPU_UTILIZATION"
        value    = 85
        operator = "GREATER_THAN"
        window   = "FIVE_MINUTES"
      }

      image {
        registry_type = "DOCKER_HUB"
        registry      = var.dockerhub_reg
        repository    = var.dockerhub_repo
        tag           = var.image_tag
      }

      env {
        key   = "GITHUB_USERNAME"
        value = var.github_username
        scope = "RUN_TIME"
        type  = "SECRET"
      }
      env {
        key   = "GITHUB_NAME"
        value = var.github_name
        scope = "RUN_TIME"
        type  = "GENERAL"
      }
      env {
        key   = "GITHUB_API_TOKEN"
        value = var.github_api_token
        scope = "RUN_TIME"
        type  = "SECRET"
      }
      env {
        key   = "GITHUB_EMAIL"
        value = var.github_email
        scope = "RUN_TIME"
        type  = "SECRET"
      }
      env {
        key   = "GITHUB_REPOSITORY"
        value = var.github_repository
        scope = "RUN_TIME"
        type  = "GENERAL"
      }
      env {
        key   = "GIN_MODE"
        value = var.gin_mode
        scope = "RUN_TIME"
        type  = "GENERAL"
      }
    }
  }
}
