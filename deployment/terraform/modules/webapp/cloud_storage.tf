
resource "random_id" "bucket_prefix" {
  byte_length = 8
}



resource "google_storage_bucket" "webapp_form_config_bucket" {
  name                        = "dqm-webapp-form-config-bucket-${random_id.bucket_prefix.hex}"
  location                    = var.cloud_storage_region
  uniform_bucket_level_access = true
  force_destroy               = true
  project                     = var.project_id
}

resource "google_storage_bucket" "webapp_upload_bucket" {
  name                        = "dqm-webapp-code-bucket-${random_id.bucket_prefix.hex}"
  location                    = var.cloud_storage_region
  uniform_bucket_level_access = true
  force_destroy               = true
  project                     = var.project_id
  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }
}
