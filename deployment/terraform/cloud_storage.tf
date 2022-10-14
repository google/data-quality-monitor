resource "google_storage_bucket" "config" {
  name                        = "dqm-config-${random_id.bucket_prefix.hex}"
  location                    = var.cloud_storage_region
  uniform_bucket_level_access = true
  force_destroy               = true

}