resource "google_workflows_workflow" "main" {
  name            = "dqm_trigger"
  region          = var.workflow_region
  description     = "Workflow that retrieves config from cloud storage and triggers cloud function"
  service_account = google_service_account.main_account.id
  source_contents = templatefile("../workflow.yaml", {
    CLOUD-FUNCTION-URL             = "${google_cloudfunctions_function.function.https_trigger_url}/process_column",
    CLOUD-BUCKET-WITH-CONFIG-FILES = "${google_storage_bucket.config.name}"
  })
  depends_on = [
    google_storage_bucket.config
  ]
}