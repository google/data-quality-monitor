resource "google_service_account" "dqm_webapp_service_account" {
  account_id   = "${var.deployment_name}-web-app"
  display_name = "DQM Webapp Service Account. This is common for both frontend and backend"
  project      = var.project_id
}

locals {
  webapp_service_account_full = "serviceAccount:${google_service_account.dqm_webapp_service_account.account_id}@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_binding" "webapp_config_bucket" {
  bucket  = google_storage_bucket.webapp_form_config_bucket.name
  role    = "roles/storage.objectUser"
  members = [local.webapp_service_account_full]
}

resource "google_storage_bucket_iam_binding" "webapp_rule_schema_bucket" {
  bucket  = var.dqm_config_bucket
  role    = "roles/storage.objectUser"
  members = [local.webapp_service_account_full]
}

resource "google_project_iam_binding" "webapp_workflows_editor" {
  project = var.project_id
  role    = "roles/workflows.editor"
  members = [local.webapp_service_account_full]
}

resource "google_project_iam_binding" "job_scheduler_admin" {
  project = var.project_id
  role    = "roles/cloudscheduler.admin"
  members = [local.webapp_service_account_full]
}

resource "google_project_iam_binding" "bigquery_admin_binding" {
  project = var.project_id
  role    = "roles/bigquery.admin"
  members = [local.webapp_service_account_full]
}

resource "google_project_iam_binding" "service_account_user_binding" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  members = [local.webapp_service_account_full]
}
