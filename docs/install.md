# Installation

## Requirements

In order to deploy DQM, you need:

* Google Cloud Project with billing enabled
* Account with Project Editor permissions
* A BigQuery table with data to check/monitor
* A BigQuery dataset to store the output log table

## Steps

DQM is deployed using Terraform, which comes pre-installed on Google Cloud Shell.

### Deployment

1. Open the Google Cloud Project where you want to deploy DQM.
1. Open the [Cloud Shell Terminal](https://shell.cloud.google.com).
1. Run `git clone https://github.com/google/data-quality-monitor`
1. Run `cd data-quality-monitor/deployment/terraform`
1. Run `cloudshell edit example.tfvars`, which will open the CloudShell Editor.
   There you can set
    1. Required:
        * `project_id`: GCP Project to deploy DQM onto
        * `backend_base_url`: Prefilled value = "/api/v1". Changes when new version of backed is released.
    1. Optional:
        * `cloud_storage_region`: Cloud Storage Bucket region to store configuration files
        * `workflow_region`: Cloud Workflows region for DQM's workflow
        * `cloud_function_region`: Cloud Function region for DQM's core
        * `service_account_name`: Name for Service Account used by DQM
        * `pause_scheduler`: Set to false to enable cloud scheduler
        * `trigger_schedule_cron`: Cron schedule to run DQM if scheduler is not paused
        * `enable_notifications`: `true` or `false` to enable e-mail notifications for DQM runtime error and rule violations
        * `notification_email`: Required if `enable_notifications` = `true`. e-mail to receive notifications
        * `notification_period`: Minimum time in between e-mail alerts. Defaults to 3600s (1 hour)

## DQM can be installed with or without Webapp

To launch an interactive step-by-step installation, you can run the following command. In this case, you do not need to read the rest of the instructions written here.

`Note:` This command can be executed ONLY in Google Cloudshell.

```sh
cloudshell launch_tutorial $(git rev-parse --show-toplevel)/deployment/gc_interactive_tutorial.md
```

  #### DQM Installation with Webapp

2. Run `terraform init`
3. Run `terraform plan -var-file="example.tfvars"`
4. If prompted, review the `gcloud` authentication prompt and click "Authorize".
5. Run `terraform apply -var-file="example.tfvars"`
6. Review the deployment plan and type `yes` to confirm.
7. Wait while terraform deploys DQM.
8. If any errors occur, resolve them and re-run the `terraform apply -var-file="example.tfvars"` command.
9. Otherwise, you have now successfully deployed DQM and DQM Webapp.
10. DQM Frontend must be accessible via this URL : https://frontend-dot-`project_id`.`app_engine_location`.r.appspot.com/
11. You can get the correct url by running the following command in your cloudshell

```sh
gcloud app services browse frontend
```


  #### DQM Installation without Webapp

2. Run `terraform init -target=module.dqm`
3. Run `terraform plan -target=module.dqm -var-file="example.tfvars"`
4. If prompted, review the `gcloud` authentication prompt and click "Authorize".
5. Run `terraform apply -target=module.dqm -var-file="example.tfvars"`
6. Review the deployment plan and type `yes` to confirm.
7. Wait while terraform deploys DQM.
8. If any errors occur, resolve them and re-run the `terraform apply -target=module.dqm -var-file="example.tfvars"` command.
9. Otherwise, you have now successfully deployed DQM.

### Setup

DQM is built to be scalable across projects, with all configuration files stored in a single Cloud Storage bucket. You only require one deployed DQM instance, which will parallelize as necessary through Cloud Workflows.

1. Navigate back to the [Cloud Shell Editor](https://ide.cloud.google.com).
1. Reopen the [Cloud Shell Terminal](https://shell.cloud.google.com).
1. Run `cloudshell edit ../config_template.json`
1. Fill in appropriate values as detailed in the [Configuration](config.md) documentation.
1. Once done, open the "File" menu and click "Download" to save the file locally.
1. Rename it appropriately, using unique names for every config file.
1. Navigate to [Google Cloud Storage](https://cloud.google.com/storage).
1. Open the bucket named `dqm-config-...` and upload the config file.
1. DQM will now pickup this config file on its next run.

### Updates

DQM can be updated and re-deployed seamlessly:

1. Open the Google Cloud Project where you have deployed DQM.
1. Open the [Cloud Shell Terminal](https://shell.cloud.google.com).
1. Run `git pull` to sync the latest code.
1. Run `terraform plan -var-file="example.tfvars"` [change it based on whether you want to ]
1. If prompted, review the `gcloud` authentication prompt and click "Authorize".
1. Run `terraform apply -var-file="example.tfvars"`
1. Review the deployment plan and type `yes` to confirm.
1. Wait while terraform re-deploys DQM.
1. If any errors occur, resolve them and re-run the `terraform apply ...` command.
1. Otherwise, you have now successfully updated DQM!

### Uninstallation

DQM is self-contained and can be removed easily. You can choose to remove DQM Webapp alone as well.

1. Open the Google Cloud Project where you have deployed DQM.
1. Open the [Cloud Shell Terminal](https://shell.cloud.google.com).
1. Run `terraform destroy` and type `yes` to confirm.

## Terraform

DQM is deployed using [Terraform](https://developer.hashicorp.com/terraform/intro). This
provides full oversight of the resources and permissions it uses, and ensures infrastructure
and changes are stored in the code repository.

### State

By default, Terraform saves its "state" in the folder where it was deployed from, i.e. in the
default case, the Cloud Shell Editor. As the Cloud Shell Editor does not persist on a project
level, it is not possible for another user to manage the terraform deployed infrastructure from
anywhere else. However, alternatively you can store state on Google Cloud Storage.

In order to do this, after completing an initial normal deployment:

1. Note the bucket name of the resource created in `google_storage_bucket.backend`.
1. Open `deployment/terraform/gcs_backend_state.tf`.
1. Fill in the bucket name in `terraform.backend.gcs`.
1. Uncomment the commented lines for `terraform.backend.gcs`.
1. Reinitialize terraform by running `terraform init`.
1. Accept connection to the new Google Cloud Storage backend.
1. Other users can then fill in the same value and share the same state.

### API & Services

Terraform will automatically enable the following APIs & Services:

* Cloud Functions (`cloudfunctions.googleapis.com`)
* Cloud Build (`cloudbuild.googleapis.com`)
* Cloud Workflows (`workflows.googleapis.com`)

Note: These will not be disabled automatically upon uninstalling DQM.

### Service Account

Terraform will automatically creates a/two service account - One for the DQM and other one for the DQM Webapp..

DQM Service account has following roles assigned;
* BigQuery Data Editor (`roles/bigquery.dataEditor`)
* BigQuery Resource Viewer (`roles/bigquery.resourceViewer`)
* BigQuery User (`roles/bigquery.user`)
* Cloud Functions Invoker (`roles/cloudfunctions.invoker`)
* Storage Object Viewer (`roles/storage.objectViewer`)
* Logging Log Writer (`roles/logging.logWriter`)
* Workflows Invoker (`roles/workflows.invoker`)

DQM Webapp Service account has following roles assigned;
* Storage Object User (`roles/storage.objectUser`)
* BigQuery Data Editor (`roles/bigquery.dataEditor`)
* Workflow Editor (`rroles/workflows.editor`)
* Cloud Scheduler Admin (`roles/cloudscheduler.admin`)
* Bigquery Metadata Viewer (`roles/bigquery.metadataViewer`)
