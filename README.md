# Data Quality Monitor

## Context

Data is the most important part of a modern business strategy. However, it's hard to
maintain the robust foundation necessary for supporting data-driven decisions.

Data Quality Monitor aims to empower clients with an easy way to monitor their data.
It can act on any data sitting in Bigquery, including exports from various Google Ads
& Marketing Platform connectors. The checks/rules are configured with a simple Python
file and scheduled as required. The output are logs that can be visualised and
monitored for subsequent action. We also provide templates for common usecases.

## Deployment

### Requirements

In order to deploy this solution you need:

* GCP project with billing enabled
* Account with Project Editor permissions

#### Service Account

Upon deployment, DQM will give it's service account the following permissions:

* BigQuery Data Editor
* BigQuery Read Session User
* BigQuery Resource Viewer
* BigQuery User
* Storage Object Viewer
* Logging Log Writer

### Steps

Deployment of DQM is done through Terraform. Terraform is fully pre-installed in the Google Cloud Shell. Take the following steps to deploy DQM:

1. Open the cloud project where you want to deploy the solution and open the Cloud Editor.
2. In the terminal, run  ``` git clone https://github.com/gtech-professional-services/data-quality-monitor ```
3. Run ``` cd data-quality-monitor/deployment/terraform ```
4. Open /deployment/terraform/example.tfvars file and fill in your GCP project id. The other variables can be changed to your requirements.
5. Run ```terraform init```
6. Run ``` terraform plan -var-file="example.tfvars" ```
7. Run ``` terraform apply -var-file="example.tfvars" ```
8. Wait for terraform to deploy DQM.

### Configuration

For DQM to know which table to scan for certain rules it uses configuration files in a Cloud Storage Bucket. config_template.json gives an example of what such files look like; they maintain the following structure:

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

### Cloud Storage Terraform State Saving

By default, Terraform saves state in the folder where it was deployed from, in this case that would be the Cloud Editor. As the Cloud Editor does not persist on a project level it is not possible for another user to manage the terraform deployed infrastructure. By taking additional steps the user can still save this state. In order to do this, complete a default deployment by following the steps above and followed the steps in gcs_backend_state.tf

## Development

### Requirements

This solution requires [Python 3.9+](https://www.python.org/downloads/). We use
[make](https://www.gnu.org/software/make/) to easily automate tooling for setup,
linting, formatting, and testing.

#### Developer Account

IAM Permissions:

* Service Account Token Creator

#### ENV file

Make a copy of `example.env` as `.env` and fill in the values:

```bash
GCP_PROJECT_ID=data-quality-monitor-example
SERVICE_ACCOUNT_EMAIL=dqm@project-id.iam.gserviceaccount.com
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
make data CONFIG=floodlight_report OUTFILE=test.csv NROWS=1000
###############################
python3 -m data.factory \
  CONFIG=<config> \
  OUTFILE=<filename> \
  NROWS=<number_of_rows>
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

## Disclaimer

This is not an officially supported Google product.

Copyright 2022 Google LLC. This solution, including any related sample code or data, is made available on an "as is", "as available", and "with all faults" basis, solely for illustrative purposes, and without warranty or representation of any kind. This solution is experimental, unsupported and provided solely for your convenience. Your use of it is subject to your agreements with Google, as applicable, and may constitute a beta feature as defined under those agreements. To the extent that you make any data available to Google in connection with your use of the solution, you represent and warrant that you have all necessary and appropriate rights, consents and permissions to permit Google to use and process that data. By using any portion of this solution, you acknowledge, assume and accept all risks, known and unknown, associated with its usage, including with respect to your deployment of any portion of this solution in your systems, or usage in connection with your business, if at all.
