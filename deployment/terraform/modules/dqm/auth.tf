resource "google_service_account" "main_account" {
  account_id   = var.deployment_name
  display_name = "DQM Service Account"
  project      = var.project_id
}

locals {
  service_account_full = "serviceAccount:${google_service_account.main_account.account_id}@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_member" "member" {
  bucket = google_storage_bucket.config.name
  role   = "roles/storage.objectViewer"
  member = local.service_account_full
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = local.service_account_full
}

resource "google_project_iam_binding" "bigquery_resource_viewer" {
  project = var.project_id
  role    = "roles/bigquery.resourceViewer"

  members = [
    local.service_account_full,
  ]
}

resource "google_project_iam_binding" "bigquery_user" {
  project = var.project_id
  role    = "roles/bigquery.user"

  members = [
    local.service_account_full,
  ]
}

resource "google_project_iam_binding" "bigquery_data_editor" {
  project = var.project_id
  role    = "roles/bigquery.dataEditor"

  members = [
    local.service_account_full,
  ]
}

resource "google_project_iam_binding" "logs_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"

  members = [
    local.service_account_full,
  ]
}

resource "google_project_iam_binding" "workflows_invoker" {
  project = var.project_id
  role    = "roles/workflows.invoker"

  members = [
    local.service_account_full,
  ]
}
