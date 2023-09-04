variable "backend_base_url" {
  type        = string
  description = "base url of DQM backend. this is a relative path"
  default     = "/api/v1"
}

variable "project_id" {
  type        = string
  description = "project id where dqm is deployed"
}

variable "cloud_storage_region" {
  type        = string
  description = "region where to deploy the cloud storage bucket containing the DQM config"
}

variable "workflow_region" {
  type        = string
  description = "region where dqm workflow is deployed"
}

variable "dqm_config_bucket" {
  type        = string
  description = "bucket created to store multiple rule config files"
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
