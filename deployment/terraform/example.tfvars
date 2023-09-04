project_id            = "YOUR-PROJECT-ID"
cloud_storage_region  = "EU"           # or US
workflow_region       = "europe-west1" # europe-west1
cloud_function_region = "europe-west1" # europe-west1

# DQM can send you email alerts when an error occured or a rule was violated. This is disabled by default but uncomment and complete the below to enable.
# enable_notifications = "true"
# notification_email   = "YOUR-EMAIL"
# notification_period  = "3600s" # minimum time in between email alerts (avoids overloading you with email alerts)

# list of members who should have access to DQM WebApp
# Few Examples of members =>
# group:support@example.com
# user:abc@example.com
# serviceAccount:my-other-app@appspot.gserviceaccount.com
# domain:example.com
# projectOwner:my-example-project
webapp_members = ["user:abc@example.com", "group:support@example.com"] # list of users, groups, serviceAccounts etc. https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/iap_web_type_app_engine_iam#google_iap_web_type_app_engine_iam_member

# Enable following variable only when you already have a "default"
# service in appEngine and want to give a different name to your
# backend service. For example: backend
# webapp_backend_name = "backend"
