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

variable "service_account_name" {
  type        = string
  description = "name for the service account"
}

variable "cloud_function_region" {
  type        = string
  description = "region where to deploy the cloud function"
}

variable "bigquery_location" {
  type        = string
  description = "region where to call BigQuery"
}
