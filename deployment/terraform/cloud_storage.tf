resource "google_storage_bucket" "config" {
  name                        = var.config_bucket
  location                    = var.cloud_storage_region
  uniform_bucket_level_access = true
  force_destroy               = true

}