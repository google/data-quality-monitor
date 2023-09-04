<h1 id="get-started-with-DQM" data-text="Get started with Data Quality Monitor">Data Quality Monitor</h1>

<section class="intro">

<p>Data Quality Monitor (DQM) aims to empower clients with an easy way to monitor their data.
It runs on Google Cloud Platform (GCP) and can act on any data in BigQuery, including
exports from various Google Ads & Marketing Platform connectors. The checks/rules are
configured with a simple JSON file and managed with Cloud Scheduler and Cloud Workflows. The output are
logs that can be visualized and monitored for subsequent action. We also provide templates
for common use cases.</p>

</section>

<section class="prereqs">

<h2 id="dqm-installation" data-text="DQM installation">DQM Installation</h2>
<h5>Prerequisites:</h5>
<p>In order to deploy DQM, you need:</p>

<ol>
<li><p>Google Cloud Project with billing enabled.</p></li>
<li><p>Account with Project Editor permissions.</p></li>
<li><p>A BigQuery table with data to check/monitor.</p></li>
<li><p>Move objects in your Cloud Storage bucket.</p></li>
<li><p>A BigQuery dataset to store the output log table.</p></li>
</ol>

<p>Estimated time to complete:
<walkthrough-tutorial-duration duration="5"></walkthrough-tutorial-duration></p>
<p>To begin, click <strong>Start</strong>.</p>

</section>

<h2 id="set-up-a-project" data-text="Set up a project">Set up a project</h2>

<ol>
<li><walkthrough-project-setup billing></walkthrough-project-setup></li>
</ol>

<section class="steps">

<h2 id="modify-config-file" data-text="Modify Terraform Variable file">DQM Installation</h2>

<walkthrough-editor-open-file filePath="deployment/terraform/example.tfvars">Edit Terraform Variable File</walkthrough-editor-open-file>

<p>Info to fill the values:</p>

1. Required:
   - `project_id`: GCP Project to deploy DQM onto
2. Optional:
   - `cloud_storage_region`: Cloud Storage Bucket region to store configuration files
   - `workflow_region`: Cloud Workflows region for DQM's workflow
   - `cloud_function_region`: Cloud Function region for DQM's core
   - `service_account_name`: Name for Service Account used by DQM
   - `pause_scheduler`: Set to false to enable cloud scheduler
   - `trigger_schedule_cron`: Cron schedule to run DQM if scheduler is not paused
   - `enable_notifications`: `true` or `false` to enable e-mail notifications for DQM runtime error and rule violations
   - `notification_email`: Required if `enable_notifications = true`. e-mail to receive notifications
   - `notification_period`: Minimum time in between e-mail alerts. Defaults to 3600s (1 hour)

<p>Did you save the config file with relevant information? Then click <strong>Next</strong></p>
<h2 id="move-to-terraform-dir" data-text="move-to-terraform-dir">Change dir to terraform dir</h2>
<p>Run the following command in cloud shell to change the correct directory</p>

```sh
cd deployment/terraform
```

<h2 id="initiate-terraform" data-text="Initiate Terraform">Initialize terraform</h2>
<p>Run the following command in cloud shell to run the terraform</p>

```sh
terraform init
```

<h2 id="plan-terraform" data-text="Plan Terraform">Plan terraform</h2>
<p>Plan terraform by providing the terraform variable file you modified in previous step.</p>

```sh
terraform plan -var-file="example.tfvars"
```

<p> If prompted, review the <code translate="no" dir="ltr">gcloud</code> authentication prompt and click <strong><i><code translate="no" dir="ltr">Authorize</code></i></strong>.
<h2 id="apply-terraform" data-text="Apply Terraform">Apply terraform</h2>
<p>Run following command to apply terraform</p>

```sh
terraform apply -var-file="example.tfvars"
```

<p>During the deployment, <code translate="no" dir="ltr">a confirmation is required</code>, type <code translate="no" dir="ltr">yes</code> to confirm when prompted.</p>
<p>Wait while terraform deploys DQM.</p>

<h5> An Error occured?</h5>
<p>If any errors occur, resolve them and re-run the following command again:</p>

```sh
terraform plan -var-file="example.tfvars"
```

<p>Otherwise, you have now <code translate="no" dir="ltr">successfully</code> deployed DQM!</p>

</section>
<walkthrough-inline-feedback></walkthrough-inline-feedback>
