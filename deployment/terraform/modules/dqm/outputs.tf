/*
Configure all the information, resources etc, which you
want to use it outside this module. For example:
Bucket created by DQM is used as an input variable
in DQM Webapp module.
**/

output "dqm_config_bucket" {
  value = google_storage_bucket.config.name
}
