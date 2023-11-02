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

variable "trigger_schedule_cron" {
  type        = string
  description = "cron defining how often cloud scheduler should trigger dqm"
}

variable "pause_scheduler" {
  type        = string
  description = "true or false, depending if scheduler should automatically trigger the workflow"
}

variable "enable_notifications" {
  type        = string
  description = "true or false, if enabled the alerting policy will be enabled"
  default     = "false"
}

variable "notification_email" {
  type        = string
  description = "email adress to receive execution notifications"
  default     = null
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
