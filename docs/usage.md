# Usage

## Execution

### Automated Schedule

If you want DQM to run on an automated schedule:

1. Navigate to [Cloud Workflows](https://console.cloud.google.com/workflows).
1. Select the `dqm_trigger` workflow and click "Edit".
1. Add a new "Cloud Scheduler" trigger.
1. If prompted, review the [Cloud Scheduler](https://cloud.google.com/scheduler) API prompt and click "Enable".
1. Give the trigger a name, and choose the region that matches your workflow.
1. Determine an appropriate [cron schedule](https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules#cron_job_format) for the chosen timezone, using the help tooltips.
1. Click "Continue" and leave the workflow argument empty - `{}`.
1. Select "All calls" for the workflow call log level.
1. Select the "DQM Service Account" (`tfvars` default: `dqm-account@<project-id>.iam.gserviceaccount.com`).
1. Click "Next" and save the trigger.
1. Click "Next" to proceed to the workflow definition page.
1. Click "Deploy" to save and re-deploy the workflow with a trigger.
1. DQM will now automatically run on a schedule.

### Manual Trigger

If you want to run DQM manually:

`Note:` If you are using DQM Webapp, you can visit `Workflow` page in webapp to trigger or view all the workflow executions. You can also view entire log, in case of failure.

1. Navigate to [Cloud Workflows](https://console.cloud.google.com/workflows).
1. Select the `dqm_trigger` workflow and click "Execute".
1. Leave the input empty - `{}` and select "All calls" for the log level.
1. Click "Execute" to start the DQM run.
1. You can observe the workflow logs within the UI.
1. Once completed, you can view the output logs in BigQuery.

## Output

### Logs

`Note:` If you are using DQM Webapp, you can visit `Rule Violations` page in webapp to view all the logs for your provided project, dataset and log table name.


DQM outputs extensive logging, which can be leveraged for notifications or dashboards.

If you specify a `log_table`, they're stored in BigQuery; otherwise, they go to Cloud Logging.

The logged fields are described below:

Required:

* `dqm_version_id`: DQM release version
* `workflow_execution_id`: Cloud Workflow execution ID
* `run_timestamp_utc`: Timestamp (in UTC) of when DQM started
* `project_id`: GCP source project ID
* `dataset_id`: BigQuery source dataset ID
* `table_name`: BigQuery source table name
* `full_table_id`: Full BigQuery table ID (`project_id.dataset_id.table_name`)
* `log_type`: One of (system, parser, rule) depending on the error
* `column`: Name of the column being processed
* `error`: Error message provided for the issue

Nullable:

* `parser`: Name of the parser, when log_type is parser
* `rule`: Name of the rule, when log_type is rule
* `rule_params`: Arguments passed to the rule, when log_type is rule
* `value`: Data value causing failure, when log_type is not system

## Alerting

### Notification Policy

`Note:` Management of `Notification or alerting` is yet available in Webapp.

By default, DQM deploys alerting policies that can be enabled during deployment by changing `enable_notifications` in the `tfvars` file. Policies can also be enabled/disabled individaully through the GCP UI in [Monitories Policies](https://console.cloud.google.com/monitoring/alerting/policies). DQM deploys the following policies:

* **\[DQM\] Workflow execution error**: Triggered when an error/warning occurs in the Cloud Workflow
* **\[DQM\] Cloud Function execution error**: Triggered when an error occurs in the Cloud Function
* **\[DQM\] Rule or Parser violations**: Triggered when a rule is violated or parsing failure occured

If enables, e-mail alerts are send to the `notification_email` in the `tfvars` file with the `notification_period` as minimum time in between notifications to prevent excessive alerting in the case of an error.
