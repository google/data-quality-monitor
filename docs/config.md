# Configuration

DQM is configured with simple JSON files, stored on Google Cloud Storage.

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

## Settings

* `service_account_email`: (optional)
  * DQM uses the "DQM Service Account" from `tfvars`
    (default: `dqm-account@<project-id>.iam.gserviceaccount.com`).
  * Important: Remove this line, if you do not need to change this.
  * You can enter a different value, if the DQM account can impersonate it.
  * This enables the same instance of DQM to operate across project boundaries.

* `source_table`:
  * A BigQuery table/s with data to check and monitor.
  * Both the dataset and table must already exist.
  * Table name supports [pattern matching](https://cloud.google.com/bigquery/docs/reference/standard-sql/operators#comparison_operators):
    * A percent sign `%` matches any number of characters or bytes.
    * An underscore `_` matches a single character or byte.
    * You can escape `\`, `_`, or `%` using two backslashes - `\\`.
    * Example: `floodlights\\_report\\_%` will match any table starting with `floodlights_report_`.
  * DQM will loop through the matching tables.
  * Fields:
    * `project_id`: BigQuery project ID
    * `dataset_id`: BigQuery dataset ID
    * `table_name`: BigQuery table name

* `log_table`: (optional)
  * A BigQuery table to store the output log table.
  * Only the dataset must already exist.
  * The table will be managed by DQM - created on first run and appended to in future runs.
  * If not specified, DQM prints to [Cloud Logging](https://cloud.google.com/logging).
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
        * `name`: `value` (see below for options)

### Data Isolation

You can setup DQM in a single GCP project and read/write BigQuery data from/to other GCP projects. This allows you to manage all your data quality checks from a central location, while maintaining isolation between different data owners. For example, you can read data from a client's BQ, run DQM on it, and output the logs back to their BQ.

To do this, you need to grant the following permissions to the DQM Service Account:

* BigQuery Data Viewer (`roles/bigquery.dataViewer`) on the source dataset
* BigQuery User (`roles/bigquery.user`) on the source table
* BigQuery Data Editor (`roles/bigquery.dataEditor`) on the log table

Advanced:

* Create a new Service Account with BigQuery User (`roles/bigquery.user`) in the foreign GCP project.
* Allow the DQM Service Account to [impersonate](https://cloud.google.com/iam/docs/impersonating-service-accounts#impersonate-sa-level) this new Service Account.
* Grant Service Account Token Creator (`roles/iam.serviceAccountTokenCreator`) to the DQM Service Account.
* Specify `service_account_email` in your config.

## Parsers

DQM always treats values from BigQuery as non-typed, i.e. the required Type
needs to be parsed first, before running Rules on the value.

We offer some common Parsers, but you can also develop your own.

Options:

* `parse_str`: Parse into a string value.
* `parse_int`: Parse a valid integer value.
* `parse_float`: Parse a valid floating point value.

## Rules

DQM only passes parsed values to Rules. The Rule checks whether the value
satisfies the condition, and returns None if it succeeds. If a rule is
violated, an Error string and metadata are logged to help you debug further.
Some Rules can also be configured with arguments to customize their behavior.

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
  * `is_not_negative`: Checks if the integer is not negative, i.e. not positive (+) or zero (0).
  * `is_not_approx_zero`: Checks if the integer is not within a tolerance of zero (0), i.e. `[0 - tolerance, 0 + tolerance].`
    * `tolerance`: float value, for approximating to zero (defaults to `1e-8`, i.e. 8 decimal digits)
  * `is_within_strict_int_range`: Checks if the provided numeric value is strictly bounded by integers, i.e. `(lower_bound, upper_bound)`.
    * `lower_bound`: lowest integer value (exclusive)
    * `upper_bound`: highest integer value (exclusive)

* `parse_float`:
  * `is_not_negative`: Checks if the integer is not negative, i.e. not positive (+) or zero (0).
  * `is_not_approx_zero`: Checks if the integer is not within a tolerance of zero (0), i.e. `[0 - tolerance, 0 + tolerance]`.
    * `tolerance`: float value, for approximating to zero (defaults to `1e-8`, i.e. 8 decimal digits)
  * `is_within_strict_int_range`: Checks if the provided numeric value is strictly bounded by integers, i.e. `(lower_bound, upper_bound)`.
    * `lower_bound`: lowest integer value (exclusive)
    * `upper_bound`: highest integer value (exclusive)
