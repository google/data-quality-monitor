resource "google_workflows_workflow" "main" {
  name            = "dqm_trigger"
  region          = var.workflow_region
  description     = "Workflow that retrieves config from cloud storage and triggers cloud function"
  service_account = google_service_account.main_account.id
  source_contents = templatefile("../workflow.yaml", {
    CLOUD-FUNCTION-URL             = "${google_cloudfunctions_function.function.https_trigger_url}",
    CLOUD-BUCKET-WITH-CONFIG-FILES = "${var.config_bucket}"
  })
  depends_on = [
    google_storage_bucket.config
  ]
}