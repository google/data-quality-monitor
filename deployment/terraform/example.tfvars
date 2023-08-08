project_id            = "YOUR-PROJECT-ID"
cloud_storage_region  = "EU" # or US
workflow_region       = "europe-west1"
cloud_function_region = "europe-west1"
service_account_name  = "dqm-account"

pause_scheduler       = true        # scheduler is paused by default, set to "false" to enable
trigger_schedule_cron = "0 8 * * *" # daily execution

# DQM can send you email alerts when an error occured or a rule was violated. This is disabled by default but uncomment and complete the below to enable.
# enable_notifications = "true"
# notification_email   = "YOUR-EMAIL"
# notification_period  = "3600s" # minimum time in between email alerts (avoids overloading you with email alerts)