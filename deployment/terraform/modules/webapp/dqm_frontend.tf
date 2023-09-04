data "archive_file" "zip_code_frontend_repo" {
  type        = "zip"
  source_dir  = "../../webapp/frontend"
  output_path = "../../dist/webapp-frontend-source.zip"
  excludes = [
    "node_modules",
    "build",
    "README.md",
    ".env.example",
    ".gitignore",
    ".env.dev",
  ]
  depends_on = [local_file.react_env_variables]
}

resource "local_file" "react_env_variables" {
  content = templatefile("${path.module}/.env-template.yaml", {
    REACT_APP_DQM_API_BASE_URL                   = "${var.backend_base_url}"
    REACT_APP_DQM_PROJECT_ID                     = "${var.project_id}",
    REACT_APP_DQM_SCHEDULE_JOB_LOCATION_ID       = "${var.workflow_region}",
    REACT_APP_DQM_WORKFLOW_LOCATION_ID           = "${var.workflow_region}",
    REACT_APP_DQM_CONFIG_BUCKET_NAME             = "${var.dqm_config_bucket}"
    REACT_APP_DQM_RULE_CONFIG_SCHEMA_BUCKET_NAME = google_storage_bucket.webapp_form_config_bucket.name
  })
  filename = "../../webapp/frontend/.env"

  depends_on = [google_storage_bucket.webapp_form_config_bucket]
}

resource "google_storage_bucket_object" "frontend_upload_object" {
  name   = "frontend-source-${data.archive_file.zip_code_frontend_repo.output_md5}.zip"
  bucket = google_storage_bucket.webapp_upload_bucket.name
  source = "../../dist/webapp-frontend-source.zip"
  depends_on = [
    data.archive_file.zip_code_frontend_repo
  ]
}

resource "google_storage_bucket_object" "form_config_upload_object" {
  name   = "form_schema.json"
  bucket = google_storage_bucket.webapp_form_config_bucket.name
  source = "../form_schema.json"
}

resource "google_app_engine_standard_app_version" "frontend" {
  version_id                = "v1"
  service                   = "frontend"
  project                   = var.project_id
  runtime                   = "nodejs20" # Replace with your desired Node.js runtime version
  instance_class            = "F4_1G"
  service_account           = "${google_service_account.dqm_webapp_service_account.account_id}@${var.project_id}.iam.gserviceaccount.com"
  delete_service_on_destroy = true
  entrypoint {
    shell = "NODE_ENV=production npm run start"
  }
  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${google_storage_bucket.webapp_upload_bucket.name}/${google_storage_bucket_object.frontend_upload_object.name}"
    }
  }
  depends_on = [
    google_storage_bucket_object.frontend_upload_object,
    google_app_engine_standard_app_version.backend
  ]
}

resource "google_iap_web_type_app_engine_iam_binding" "binding" {
  project = var.project_id
  app_id  = var.project_id
  role    = "roles/iap.httpsResourceAccessor"
  members = var.webapp_members
}
