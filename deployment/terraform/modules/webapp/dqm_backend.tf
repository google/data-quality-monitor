data "archive_file" "zip_code_backend_repo" {
  type        = "zip"
  source_dir  = "../../webapp/backend"
  output_path = "../../dist/webapp-backend-source.zip"
  excludes = [
    "node_modules",
    "tests",
    ".env.dev",
    ".gitignore",
    ".prettierrc.js",
    "swagger.ts",
    "build",
    ".env.local",
    "README.md"
  ]
}

resource "google_storage_bucket_object" "backend_upload_object" {
  name   = "backend-source.zip-${data.archive_file.zip_code_backend_repo.output_md5}.zip"
  bucket = google_storage_bucket.webapp_upload_bucket.name
  source = "../../dist/webapp-backend-source.zip"
  depends_on = [
    data.archive_file.zip_code_backend_repo
  ]
}

resource "google_app_engine_standard_app_version" "backend" {
  version_id                = "v1"
  service                   = "default"
  project                   = var.project_id
  runtime                   = "nodejs20"
  instance_class            = "F4_1G"
  service_account           = "${google_service_account.dqm_webapp_service_account.account_id}@${var.project_id}.iam.gserviceaccount.com"
  delete_service_on_destroy = true
  lifecycle {
    prevent_destroy = true
  }
  entrypoint {
    shell = "NODE_ENV=production && npm run start"
  }
  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${google_storage_bucket.webapp_upload_bucket.name}/${google_storage_bucket_object.backend_upload_object.name}"
    }
  }
}

resource "google_app_engine_application_url_dispatch_rules" "backend-dispatch" {
  project = var.project_id
  dispatch_rules {
    domain  = "*"
    path    = "${var.backend_base_url}/*"
    service = google_app_engine_standard_app_version.backend.service
  }
}

