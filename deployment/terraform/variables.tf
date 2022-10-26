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

variable "config_bucket" {
  type        = string
  description = "cloud storage bucket where the config file will reside"
}
