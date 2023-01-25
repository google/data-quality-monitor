# Data Quality Monitor

**Continuously validate your data with easy, customizable rules**

## Context

Data is the most important part of a modern business strategy. However, it's hard to
maintain the robust foundation necessary for supporting data-driven decisions.

Data Quality Monitor (DQM) aims to empower clients with an easy way to monitor their data.
It runs on Google Cloud Platform (GCP) and can act on any data sitting in BigQuery, including
exports from various Google Ads & Marketing Platform connectors. The checks/rules are
configured with a simple JSON file and managed with scheduled Cloud Workflows. The output are
logs that can be visualized and monitored for subsequent action. We also provide templates
for common use cases.

## Disclaimer

DQM is fully owned and managed by you, within your GCP project.

DQM is designed to be resource-efficient and low-cost. There are no additional fees - you only pay for the underlying usage of GCP resources.

We provide DQM as an open-source solution, so you can contribute to or expand on its features.

## Resources and Updates

Join the [Google group](https://groups.google.com/g/data-quality-monitor-external-users) to:

* View the [slide deck](https://docs.google.com/presentation/d/1OKrkZjrdi8U90dT6TbR0G0rYhihn9UVzoI88DTUiJMg/edit?usp=sharing) with a high level pitch, the solution architecture, and example use cases.
* Receive email updates on new features and updates.
* Connect with DQM's developers and other users.

## Installation

### Pre-requisites

In order to deploy this solution you need:

* Google Cloud Project with billing enabled
* Account with Project Editor permissions
* A BigQuery table with data to check/monitor
* A BigQuery dataset to store the output log table

### Steps

DQM uses Terraform, which comes fully pre-installed on Google Cloud Shell.

#### Deployment

1. Open the Google Cloud Project where you want to deploy DQM.
1. Navigate to the [Cloud Shell Editor](https://ide.cloud.google.com/).
1. Open the [Cloud Shell Terminal](https://shell.cloud.google.com/).
1. Run `git clone https://github.com/google/data-quality-monitor`
1. Run `cd data-quality-monitor/deployment/terraform`
1. Run `cloudshell edit example.tfvars` and set the following values:
    1. Required:
        * `project_id`: GCP Project to deploy DQM onto
    1. Optional:
        * `cloud_storage_region`: Cloud Storage Bucket region to store configuration files
        * `workflow_region`: Cloud Workflows region for DQM's workflow
        * `cloud_function_region`: Cloud Function region for DQM's core
        * `service_account_name`: Name for Service Account used by DQM
1. Run `terraform init`
1. Review the `gcloud` authentication prompt and click "Authorize".
1. Run `terraform plan -var-file="example.tfvars"`
1. Run `terraform apply -var-file="example.tfvars"`
1. Review the deployment plan and type `yes` to confirm.
1. Wait while terraform deploys DQM.
1. If any errors occur, resolve them and re-run the `terraform apply ...` command.
1. Otherwise, you have now successfully deployed DQM!

#### Setup

DQM is built to be scalable across projects, with all configuration files stored in a single Cloud Storage bucket. You only require one deployed DQM instance, which will parallelize as necessary through Cloud Workflows.

1. Navigate back to the [Cloud Shell Editor](https://ide.cloud.google.com/).
1. Reopen the [Cloud Shell Terminal](https://shell.cloud.google.com/).
1. Run `cloudshell edit ../config_template.json`
1. Fill in appropriate values as detailed in the [Configuration](#configuration) section below.
1. Once done, open the "File" menu and click "Download" to save the file locally.
1. Rename it appropriately, using unique names for every config file.
1. Navigate to [Google Cloud Storage](https://cloud.google.com/storage).
1. Open the bucket named `dqm-config-...` and upload the config file.
1. DQM will now pickup this config file on its next run.

#### Automation

DQM can automatically run on your desired schedule with a Cloud Scheduler trigger.

1. Navigate to [Cloud Workflows](https://console.cloud.google.com/workflows).
1. Select the `dqm_trigger` workflow and click "Edit".
1. Add a new "Cloud Scheduler" trigger.
1. If prompted, review the Cloud Scheduler API prompt and click "Enable".
1. Give the trigger a name, and choose the region that matches your workflow.
1. Determine an appropriate [cron schedule](https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules#cron_job_format) for the chosen timezone, using the help tooltips.
1. Click "Continue" and leave the workflow argument empty - `{}`.
1. Select "All calls" for the workflow call log level.
1. Select the "DQM Service Account" (`tfvars` default: `dqm-account@<project-id>.iam.gserviceaccount.com`).
1. Click "Next" and save the trigger.
1. Click "Next" to proceed to the workflow definition page.
1. Click "Deploy" to save and re-deploy the workflow with a trigger.
1. DQM will now automatically run on a schedule.

#### Execution (optional)

If you want to bypass the schedule and run DQM manually:

1. Navigate to [Cloud Workflows](https://console.cloud.google.com/workflows).
1. Select the `dqm_trigger` workflow and click "Execute".
1. Leave the input empty - `{}` and select "All calls" for the log level.
1. Click "Execute".
1. You can observe the runtime logs within the UI.
1. Once completed, you can view the output logs in BigQuery.

### Configuration

DQM reads configuration files from a Cloud Storage Bucket, which is created during deployment.

An example is provided in `deployment/config_template.json`, and below:

```json
{
  "service_account_email": "SERVICE-ACCOUNT-EMAIL",
  "source_table": {
    "project_id": "YOUR-GCP-PROJECT-ID",
    "dataset_id": "BIGQUERY-DATASET",
    "table_name": "STRING-TO-FILTER-ON-IN-TABLE-NAME"
  },
  "log_table": {
    "project_id": "BIGQUERY-PROJECT-TO-STORE-LOGS",
    "dataset_id": "BIGQUERY-DATASET-TO-STORE-LOGS",
    "table_name": "BIGQUERY-TABLE-TO-STORE-LOGS"
  },
  "columns": {
    "SOME-COLUMN-NAME": {
      "parser": "SOME-PARSER-NAME",
      "rules": [
        {
          "rule": "SOME-RULE-NAME",
          "args": {
            "SOME-RULE-ARG": 0,
            "SOME-OTHER-RULE-ARG": 1
          }
        }
      ]
    },
    "SOME-OTHER-COLUMN-NAME": {
      "parser": "SOME-PARSER-NAME",
      "rules": [
        {
          "rule": "SOME-RULE-NAME",
          "args": {
            "SOME-RULE-ARG": "[0-9]+"
          }
        }
      ]
    }
  }
}
```

#### Settings

* `service_account_email`: (optional)
  * DQM uses the "DQM Service Account" (`tfvars` default: `dqm-account@<project-id>.iam.gserviceaccount.com`)
  * Important: Remove this line, if you do not need to change this.
  * You can enter a different value, if the DQM account can impersonate it.
  * This enables the same instance of DQM to operate across project boundaries.

* BigQuery tables:
  * `source_table`: A BigQuery table with data to check/monitor
  * `log_table`: A BigQuery table to store the output log table
  * Fields:
    * `project_id`: BigQuery project ID
    * `dataset_id`: BigQuery dataset ID
    * `table_name`: BigQuery table name

* BigQuery table `columns`: (mapping)
  * key: BigQuery table column name
  * value:
    * `parser`: [Parser name](#parsers)
    * `rules`: (list)
      * `rule`: [Rule name](#rules)
      * `args`: (mapping, optional)
        * `name`: `value` (see below, for options)

#### Parsers

DQM always treats values from BigQuery as untyped, i.e. the required Type needs
to be parsed first, before running Rules on the value.

We offer some common Parsers, but you can also develop your own.

Options:

* `parse_str`: Convert into a string value.
* `parse_int`: Parse a valid integer value.
* `parse_float`: Parse a valid floating point value.

#### Rules

DQM only passes parsed values to Rules. The Rule checks whether the value
satisfies the condition, and returns None if it succeeds. Otherwise,
an Error string and metadata are logged to help you debug further. Some
Rules can also be configured with arguments to customize their behavior.

We offer some pre-built Rules, but you can also develop your own.

Options per Parser, with possible arguments:

* `parse_str`:
  * `contains_at_sign`: Checks if the string contains "@", e.g. for quickly detecting email addresses.
  * `is_email`: Checks if the string is possibly an email address.
  * `is_phone_number`: Checks if the string is possibly a phone number.
  * `fully_matches_regex`: Checks if the string fully matches a given regular expression.
    * `regex`: [Python-compatible regex](https://docs.python.org/3/howto/regex.html)
  * `contains_regex`: Checks if the string contains some part of a given regular
    expression.
    * `regex`: [Python-compatible regex](https://docs.python.org/3/howto/regex.html)

* `parse_int`:
  * `is_not_negative`: Checks if the integer is not negative, i.e not positive (+) or zero (0).
  * `is_not_approx_zero`: Checks if the integer is not within a tolerance of zero (0), i.e [0 - tolerance, 0 + tolerance].
    * `tolerance`: float value, for approximating to zero (defaults to `1e-8`, i.e. 8 decimal digits)
  * `is_within_strict_int_range`: Checks if the provided numeric value is strictly bounded by integers, i.e. (lower_bound, upper_bound) with both bounds exclusive.
    * `lower_bound`: lowest integer value (exclusive)
    * `upper_bound`: highest integer value (exclusive)

* `parse_float`:
  * `is_not_negative`: Checks if the integer is not negative, i.e not positive (+) or zero (0).
  * `is_not_approx_zero`: Checks if the integer is not within a tolerance of zero (0), i.e [0 - tolerance, 0 + tolerance].
    * `tolerance`: float value, for approximating to zero (defaults to `1e-8`, i.e. 8 decimal digits)
  * `is_within_strict_int_range`: Checks if the provided numeric value is strictly bounded by integers, i.e. (lower_bound, upper_bound) with both bounds exclusive.
    * `lower_bound`: lowest integer value (exclusive)
    * `upper_bound`: highest integer value (exclusive)

### Terraform

DQM is deployed using [Terraform](https://developer.hashicorp.com/terraform/intro). This
provides full oversight of the resources and permissions it uses, and ensures infrastructure
and changes are stored in the code repository.

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

#### API & Services

DQM will automatically enable the following APIs & Services:

* Cloud Functions: `cloudfunctions.googleapis.com`
* Cloud Build: `cloudbuild.googleapis.com`
* Cloud Workflows: `workflows.googleapis.com`

#### Service Account

DQM will automatically create a service account with the following permissions:

* BigQuery Data Editor: `roles/bigquery.dataEditor`
* BigQuery Resource Viewer: `roles/bigquery.resourceViewer`
* BigQuery User: `roles/bigquery.user`
* Cloud Function Invoker: `roles/cloudfunctions.invoker`
* Storage Object Viewer: `roles/storage.objectViewer`
* Logging Log Writer: `roles/logging.logWriter`

## Development

### Requirements

This solution requires [Python 3.10+](https://www.python.org/downloads/). We use
[make](https://www.gnu.org/software/make/) to seamlessly automate the underlying tooling.

#### Developer Account

You will need an Account that has the following IAM permissions:

* Service Account Token Creator: `roles/iam.serviceAccountTokenCreator`

#### ENV file

Make a copy of `example.env` as `.env` and fill in the values:

```bash
GCP_PROJECT_ID=<project-id>
SERVICE_ACCOUNT_EMAIL=dqm@<project-id>.iam.gserviceaccount.com
```

### Workflow

The standard make workflow is depicted below, alongside
the underlying commands for reference.

```bash
# Install dev environment
make install
###############################
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
pre-commit install
###############################

# Setup cloud environment
###############################
export $(xargs <.env)
gcloud auth login
gcloud config set project $GCP_PROJECT_ID
###############################

# Lint & type-check code
make lint
###############################
python3 -m flake8 .
python3 -m mypy .
###############################

# Format code
make format
###############################
python3 -m isort --atomic .
python3 -m yapf --parallel --recursive --in-place .
###############################

# Run tests
make test
###############################
export $(xargs <.env)
python3 -m unittest
###############################

# Run local debug server
make server
###############################
functions_framework --debug --target app
###############################

# POST JSON to local debug server
make call ENDPOINT=route JSON=test.json
###############################
curl localhost:8080/<endpoint-route> \
  -H "Content-Type: application/json" \
  -d @<json_file>
###############################

# Generate test data into data/ folder
make data CONFIG=config_name \
          OUTFILE=test.csv \
          NROWS=1000
###############################
python3 -m data.generate \
  CONFIG=<config> \
  OUTFILE=<filename> \
  NROWS=<number_of_rows>
###############################

# Upload test data from data/ folder to BigQuery table
make table CONFIG=config_name \
           INFILE=test.csv \
           TABLE=project.dataset.table \
           ACTION=APPEND/REPLACE \
           SAEMAIL=service@account.com
###############################
python3 -m data.upload \
  CONFIG=<config> \
  INFILE=<filename> \
  TABLE=<bigquery_full_table_id> \
  ACTION=<APPEND_or_REPLACE> \
  SAEMAIL=<service_account_email>
###############################

# Run pre-commit checks
make verify
###############################
pre-commit run --all-files
###############################

# Cleanup environment
make clean
###############################
find . -type f -name "*.py[co]" -prune -exec rm -rf "{}" \;
find . -type d -name __pycache__ -prune -exec rm -rf "{}" \;
find . -type d -name .mypy_cache -prune -exec rm -rf "{}" \;
###############################

# Uninstall dev environment
make uninstall
###############################
pre-commit uninstall \
  -t pre-commit \
  -t pre-merge-commit \
  -t pre-push \
  -t prepare-commit-msg \
  -t commit-msg \
  -t post-commit \
  -t post-checkout \
  -t post-merge \
  -t post-rewrite
 rm -rf ./venv/
###############################
```

## License

**This is not an officially supported Google product.**

Copyright 2023 Google LLC. This solution, including any related sample code or data, is made available on an "as is", "as available", and "with all faults" basis, solely for illustrative purposes, and without warranty or representation of any kind. This solution is experimental, unsupported and provided solely for your convenience. Your use of it is subject to your agreements with Google, as applicable, and may constitute a beta feature as defined under those agreements. To the extent that you make any data available to Google in connection with your use of the solution, you represent and warrant that you have all necessary and appropriate rights, consents and permissions to permit Google to use and process that data. By using any portion of this solution, you acknowledge, assume and accept all risks, known and unknown, associated with its usage, including with respect to your deployment of any portion of this solution in your systems, or usage in connection with your business, if at all.
