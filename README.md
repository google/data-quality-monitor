# Data Quality Monitor

## Context

Data is the most important part of a modern business strategy. However, it's hard to
maintain the robust foundation necessary for supporting data-driven decisions.

Data Quality Monitor aims to empower clients with an easy way to monitor their data.
It can act on any data sitting in Bigquery, including exports from various Google Ads
& Marketing Platform connectors. The checks/rules are configured with a simple Python
file and scheduled as required. The output are logs that can be visualised and
monitored for subsequent action. We also provide templates for common usecases.

## Development

This solution requires [Python 3.9+](https://www.python.org/downloads/). We use
[make](https://www.gnu.org/software/make/) to easily automate tooling for setup,
linting, formatting, and testing. A standard workflow is depicted below, alongside
the underlying commands for reference.

```bash
# Setup dev environment
make setup
###############################
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r requirements.txt
pre-commit install
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
python3 -m yapf --parallel --recursive --in-place .
python3 -m isort --atomic .
###############################

# Run tests
make test
###############################
python3 -m unittest
###############################

# Run pre-commit checks
make verify
###############################
pre-commit run --all-files
###############################
```
