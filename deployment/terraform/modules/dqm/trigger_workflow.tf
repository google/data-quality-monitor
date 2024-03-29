resource "google_workflows_workflow" "main" {
  name            = "${var.deployment_name}-trigger"
  region          = var.workflow_region
  description     = "Workflow that retrieves config from cloud storage and triggers cloud function"
  service_account = google_service_account.main_account.id
  project         = var.project_id
  labels          = { "tag" = "${var.dqm_resource_tag}" }
  source_contents = templatefile("../workflow.yaml", {
    CLOUD-FUNCTION-URL             = "${google_cloudfunctions_function.function.https_trigger_url}",
    CLOUD-BUCKET-WITH-CONFIG-FILES = "${google_storage_bucket.config.name}",
    RESOURCE-TAG                   = "${var.dqm_resource_tag}"
  })
  depends_on = [
    google_storage_bucket.config,
    google_project_service.workflows
  ]
}
