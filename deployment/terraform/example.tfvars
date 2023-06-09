project_id            = "YOUR-PROJECT-ID"
cloud_storage_region  = "EU" # or US
bigquery_location     = "EU" # or US
workflow_region       = "europe-west1"
cloud_function_region = "europe-west1"
service_account_name  = "dqm-account"

pause_scheduler       = true        # scheduler is paused by default, set to "false" to enable
trigger_schedule_cron = "0 8 * * *" # daily execution