variable "backend_base_url" {
  type        = string
  description = "base url of DQM backend. this is a relative path"
  default     = "/api/v1" // starts with a slash '/' but should not end with slash '/'
}
variable "project_id" {
  type        = string
  description = "project id where to deploy dqm"
}

variable "cloud_storage_region" {
  type        = string
  description = "region where to deploy the cloud storage bucket containing the DQM config"
}

variable "workflow_region" {
  type        = string
  description = "region where to deploy the workflow"
}

variable "cloud_function_region" {
  type        = string
  description = "region where to deploy the cloud function"
}

variable "dqm_config_bucket" {
  type        = string
  description = "bucket created to store multiple rule config files"
  default     = ""
}

variable "trigger_schedule_cron" {
  type        = string
  description = "cron defining how often cloud scheduler should trigger dqm"
  default     = "0 8 * * 1" //At 08:00 on every Monday
}

variable "pause_scheduler" {
  type        = string
  description = "true or false, depending if scheduler should automatically trigger the workflow"
  default     = "true"
}

variable "enable_notifications" {
  type        = string
  description = "true or false, if enabled the alerting policy will be enabled"
  default     = "false"
}

variable "notification_email" {
  type        = string
  description = "email adress to receive execution notifications"
  default     = ""
}

variable "notification_period" {
  type        = string
  description = "minimum time in between email notifications"
  default     = "3600s"
}

variable "dqm_resource_tag" {
  type        = string
  description = "tag used for all the dqm resources"
  default     = "dqm"
}

variable "webapp_members" {
  type        = list(any)
  description = "list of members who should be able to access webapp"
}

variable "webapp_backend_name" {
  type        = string
  description = "default service name for the dqm web"
  default     = "default"
}

variable "deployment_name" {
  type        = string
  description = "Name of the DQM deployment"
  default     = "data-quality-monitor"
}

variable "backend_name" {
  type        = string
  description = "Name of the DQM webapp backend"
  default     = "default"
}
