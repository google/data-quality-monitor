# Configuration

DQM is configured with simple JSON files, stored on Google Cloud Storage.

An example is provided in `deployment/config_template.json`, and below:


`Note:` Please note that if you are utilizing the DQM Webapp, there is no requirement to manually configure this file or upload it to the Google Cloud Storage Bucket. Instead, you can conveniently create, modify, or delete these configuration files using dynamically generated forms in DQM Webapp. Simply input the required values, and a JSON file will be automatically generated and uploaded to the designated bucket.

```json
{
  "service_account_email": "SERVICE-ACCOUNT-EMAIL",
  "source_table": {
    "project_id": "YOUR-GCP-PROJECT-ID",
    "dataset_id": "BIGQUERY-DATASET",
    "table_name": "STRING-TO-FILTER-ON-IN-TABLE-NAME",
    "n_tables_to_check": "NUMBER-OF-RECENT-TABLES"
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
    * DQM retrieves all tables matching the table name pattern. Specify the number of tables to check in `n_tables_to_check`, most recently created table first. e.g check only most recent table: `n_tables_to_check` = 1

  * DQM will loop through the matching tables.
  * Important: Make sure that the DQM service account has `roles/bigquery.dataViewer` access on the dataset.
  * Fields:
    * `project_id`: BigQuery project ID
    * `dataset_id`: BigQuery dataset ID
    * `table_name`: BigQuery table name
    * `n_tables_to_check`: Number of tables DQM will check

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
  * key: BigQuery table column name. Supports nested (Repeated and Nullable records BQ data type) columns. More details [here]()
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

### Nested column logic for column name

The DQM configuration file allows you to target specific columns within complex data structures in your BigQuery tables. Here's how to handle nested columns and extract values from arrays of structs:

**1. Nested Columns**

* Use dot notation to reference columns within nested structures (STRUCTs in BigQuery).

**Example:**

```
column2.nested_column1 
```

*  This targets `nested_column1`  within the `column2` struct.

**2. Key-Value Logic within Arrays**

* Employ the `key[some_value]` syntax to extract values from arrays of structs where the elements have a `key` field.

**Example:**

```
event_params.key[ga_session_id]
```

* This targets the `value` where the corresponding `key` is "ga_session_number" within the `event_params` array.

**Key Points:**

* **Matching Logic:** The `key[some_value]` syntax will extract the **first** matching value within the array.
* **Parsers:** Choose parsers that are compatible with the data type of the values you are extracting (e.g., `parse_int` for integers, `parse_str` for strings).
* **Custom Rules:** For more complex logic or to process multiple values with the same key, you can write custom Python rules.

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
