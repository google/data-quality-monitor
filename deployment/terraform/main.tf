module "dqm" {
  source = "./modules/dqm"

  project_id            = var.project_id
  cloud_storage_region  = var.cloud_storage_region
  workflow_region       = var.workflow_region
  cloud_function_region = var.cloud_function_region
  pause_scheduler       = var.pause_scheduler       # scheduler is paused by default, set to "false" to enable
  trigger_schedule_cron = var.trigger_schedule_cron # daily execution

  # DQM can send you email alerts when an error occured or a rule was violated. This is disabled by default but uncomment and complete the below to enable.
  enable_notifications = var.enable_notifications
  notification_email   = var.notification_email
  notification_period  = var.notification_period # minimum time in between email alerts (avoids overloading you with email alerts)

}

module "webapp" {
  source               = "./modules/webapp"
  backend_base_url     = var.backend_base_url
  project_id           = var.project_id
  cloud_storage_region = var.cloud_storage_region
  workflow_region      = var.workflow_region
  dqm_config_bucket    = module.dqm.dqm_config_bucket
  depends_on           = [module.dqm]
  webapp_members       = var.webapp_members
}
