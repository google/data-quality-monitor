# Links terraform to a cloud storage backend to manage Terraform state.
# Conduct the following steps:
# 1. Deploy DQM through regular terraform workflow; init, plan, deploy
# 2. Note down the bucket name of the resource created in
# "google_storage_bucket.backend".
# 3. Fill in the bucket name in terraform.backend.gcs below.
# 4. Uncomment terraform.backend.gcs
# 5. Reinitizalize terraform through terraform init and accept connection
# to GCS backend.

resource "google_storage_bucket" "backend" {
  name                        = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy               = false
  location                    = var.cloud_storage_region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  project                     = var.project_id
  versioning {
    enabled = true
  }
}

# terraform {
#  backend "gcs" {
#    bucket  = [YOUR-BACKEND-BUCKET-NAME]
#    prefix  = "terraform/state"
#  }
# }
