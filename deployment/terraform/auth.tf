resource "google_service_account" "main_account" {
  account_id   = var.service_account_name
  display_name = "DQM Service Account"
}

resource "google_storage_bucket_iam_member" "member" {
  bucket = google_storage_bucket.config.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.main_account.account_id}@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "serviceAccount:${google_service_account.main_account.account_id}@${var.project_id}.iam.gserviceaccount.com"
}
