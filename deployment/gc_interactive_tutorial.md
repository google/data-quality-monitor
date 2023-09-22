<h1 id="get-started-with-DQM" data-text="Get started with Data Quality Monitor">Data Quality Monitor</h1>
<section class="intro">
   <p>Data Quality Monitor (DQM) aims to empower clients with an easy way to monitor their data.
      It runs on Google Cloud Platform (GCP) and can act on any data in BigQuery, including exports from various Google Ads & Marketing Platform connectors. The checks/rules are configured with a simple JSON file and managed with Cloud Scheduler and Cloud Workflows. The output are logs that can be visualized and monitored for subsequent action. <code translate="no" dir="ltr">You can choose to install DQM with or without webapp</code>
   </p>
</section>
<section class="prereqs">
   <h2 id="dqm-installation" data-text="DQM installation">DQM Installation</h2>
   <p>In order to deploy DQM, you need:</p>
   <ol>
      <li>
         <p>Google Cloud Project with billing enabled.</p>
      </li>
      <li>
         <p>A BigQuery table with data to monitor.</p>
      </li>
      <li>
         <p>A BigQuery dataset to store the output</p>
      </li>
   </ol>
   <h4>Estimated time to complete:</h4>
   <code translate="no" dir="ltr">DQM without webapp </code>
   <walkthrough-tutorial-duration duration="~5"></walkthrough-tutorial-duration>
   <code translate="no" dir="ltr">DQM with webapp </code>
   <walkthrough-tutorial-duration duration="~10"></walkthrough-tutorial-duration>
   <p>To begin, click <strong>Start</strong>.</p>
</section>
<h2 id="set-up-a-project" data-text="Set up a project">Set up a project</h2>
<ol>
   <li>
      <walkthrough-project-setup billing></walkthrough-project-setup>
   </li>
</ol>

`Note:` In order to be able to install DQM successfully, you need to have billing enabled for your project.
<h2 id="enable-apis" data-text="enable APIs">Enable APIs</h2>

<p>First set the project Id to gcloud config:</p>

```sh
gcloud config set project <walkthrough-project-name/>
```

`Note:` In order to install DQM successfully, you need to have following APIs enabled. In the following list, if there is any

For your project - `<walkthrough-project-name/>` following APIs must be enabled.

<walkthrough-enable-apis apis="cloudfunctions.googleapis.com,cloudbuild.googleapis.com,workflows.googleapis.com,cloudscheduler.googleapis.com,bigquery.googleapis.com,iap.googleapis.com,storage-api.googleapis.com, dataform.googleapis.com, cloudresourcemanager.googleapis.com, iam.googleapis.com"></walkthrough-enable-apis>


<h2 id="modify-config-file" data-text="Modify Terraform Variable file">Configure DQM Installation</h2>
Execute following command to edit the configuration file

```sh
cloudshell edit $(git rev-parse --show-toplevel)/deployment/terraform/example.tfvars
```
<p>Info to fill values for deployment:</p>

- `project_id`: GCP Project to deploy DQM onto
- `cloud_storage_region`: Cloud Storage Bucket region to store configuration files
- `workflow_region`: Cloud Workflows region for DQM's workflow
- `cloud_function_region`: Cloud Function region for DQM's core
- `enable_notifications`: `true` or `false` to enable e-mail notifications for DQM runtime error and rule violations
- `notification_email`: Required if `enable_notifications = true`. e-mail to receive notifications
- `notification_period`: Minimum time in between e-mail alerts. Defaults to 3600s (1 hour)

<p>Did you save the config file with relevant information? Then click <strong>Next</strong></p>

<h2 id="install-dqm" data-text="install-dqm">Do you have an AppEngine Created?</h2>

<strong>Note:</strong> If you <strong>DO NOT</strong> want to install Webapp of DQM, you can <strong>skip</strong> this step.

If default appEngine is not yet created, run the following command.

```sh
gcloud app create
```

<strong> Note:</strong> If, an App was not existing, it will create a your first App. This app can never be deleted. There can only be one app created in each account.

<p>Now check if, oauth-brand is created for your AppEngine by running the following command:</p>

```sh
gcloud iap oauth-brands list
```

If `orgInternalOnly` is set to `true`, then you are good to go. If it is set to `false`, please manually change it to `true`.

You can follow the tutorial to provide oAuth consent to AppEngine. https://developers.google.com/workspace/guides/configure-oauth-consent

<p>Once you are ready with the above steps...</p>

<p>Enable IAP (Identity Aware Proxy) to restrict the access to webapp to the given users or group.</p>

```sh
gcloud iap web enable --resource-type=app-engine
```

Now the above statment will enable IAP on your DQM webapplication, going to be deployed in AppEngine

<h2 id="install-dqm" data-text="install-dqm">Install DQM</h2>
<p>Run the following command in cloud shell</p>

```sh
sh $(git rev-parse --show-toplevel)/deployment/install.sh
```
<h4>Do you want to install DQM Webapp as well?</h4>
<p>Please follow the instruction in the console. Type <code translate="no" dir="ltr">yes</code> if you want to install DQM Webapp as well.</p>

```sh
yes
```

<p>During the deployment, <code translate="no" dir="ltr">a confirmation is required</code>, type <code translate="no" dir="ltr">yes</code> to confirm when prompted.</p>

```sh
yes
```

<p>
  <code translate="no" dir="ltr">Note:</code> After successful installation, you will be able to get your Webapp URL by executing following command:
</p>

```sh
gcloud app services browse frontend
```

<p>Wait while terraform deploys DQM.</p>
<h5> An Error occured?</h5>
<p>If any errors occur, resolve them and re-run the following command again:</p>

```sh
sh $(git rev-parse --show-toplevel)/deployment/install.sh
```
<p>Otherwise, you have now <code translate="no" dir="ltr">successfully</code> deployed DQM!</p>


<h2>Congratulations</h2>
<p>
   <walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>
</p>
<p>You’re all set!</p>
If you had chosen, to install DQM Webapp, you can get your DQM Webapp URL by executing following command :

```sh
gcloud app services browse frontend
```

<h4>Manage Rule Configurations, Schedule etc. </h4>
Start creating your first <code translate="no" dir="ltr">Rule Configuration</code> via webapp before running any workflow.


<walkthrough-inline-feedback></walkthrough-inline-feedback>
