# Development

## Requirements

This solution requires [Python 3.10+](https://www.python.org/downloads/). We use
[make](https://www.gnu.org/software/make/) to seamlessly automate the underlying tooling.

### Developer Account

You will need an Account that has the following IAM permissions:

* Service Account Token Creator (`roles/iam.serviceAccountTokenCreator`)

### Environment Variables

Make a copy of `example.env` as `.env` and fill in the values:

```bash
GCP_PROJECT_ID=<project-id>
SERVICE_ACCOUNT_EMAIL=dqm@<project-id>.iam.gserviceaccount.com
```

## Workflow

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
