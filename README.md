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
# Install dev environment
make install
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

# Cleanup environment
make clean
###############################
find . \
  -type f -name "*.py[co]" \
  -o -type d -name __pycache__ \
  -o -type d -name .mypy_cache \
  -exec rm -rf {} +
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
