# Data Quality Monitor Webapp

## Description

Data is the most important part of a modern business strategy. However, it's hard to maintain the robust foundation necessary for supporting data-driven decisions. DQM checks the data based on rules specified by you in a <a href="/deployment/config_template.json" target="_blank"> JSON template.</a> Maintaining this template manually is a challenging and prone to human error. DQM Webapp aims to empower you with an easy way to configure the above JSON template. By utilizing our frontend interface to set up and manage your DQM configurations, you minimize the risk of human errors. Note that, configuration form is dynamically generated based on rules configured. Additionally, our platform offers you the ability to manage, execute and schedule the DQM workflow deployed during the DQM deployment. DQM Webapp allow you to view log of all the rule violations caused in your provided database.

## Features

Main features of the web application:

1. **Manage Rule Configuration:** Allow users to create, edit, delete, and draft rule configuration files for rule settings.

2. **Manage Job Scheduler:** Enable users to control the activation and pausing of job schedulers responsible for executing DQM workflows. You can also modify the schedule of your workflow execution. Additionally, you can delete an existing schedule too.

3. **Execute Workflows:** Provide the ability to trigger and view the results of DQM workflow executions, including historical executions.

4. **View Rule Violations:** Display rule violations reported by the Data Quality Monitor, logged in a BigQuery log table. Here it gives an opportunity to review logs from user provided, projects and datasets.

---
**NOTE**


 The web application will initially have access to read log data within its own project. To enable log access from other projects, you must establish a service account with the appropriate roles as outlined below:

<strong><em>dqm-webapp@`your-current-project-id`.iam.gserviceaccount.com</em></strong>

Role which should be assigned to this service account is : `BigQuery Data Editor`

In case you want to be able to create a config file for the above project, you are required to provide following role: `BigQuery Admin`

---


## Getting Started

Installing and using of DQM Webapp is optional. You can opt out to install Webapp, during the installation of DQM. To know more abut the installation steps, please follow along in the [installation docs](./install.md).

### Prerequisites

List the prerequisites that users need to have in place before setting up and using your web application. This may include:

- Google Cloud account with billing enabled
- Google Cloud account with AppEngine Service enabled


## License

**This is not an officially supported Google product.**

Copyright 2023 Google LLC. This solution, including any related sample code or data, is made available on an "as is", "as available", and "with all faults" basis, solely for illustrative purposes, and without warranty or representation of any kind. This solution is experimental, unsupported and provided solely for your convenience. Your use of it is subject to your agreements with Google, as applicable, and may constitute a beta feature as defined under those agreements. To the extent that you make any data available to Google in connection with your use of the solution, you represent and warrant that you have all necessary and appropriate rights, consents and permissions to permit Google to use and process that data. By using any portion of this solution, you acknowledge, assume and accept all risks, known and unknown, associated with its usage, including with respect to your deployment of any portion of this solution in your systems, or usage in connection with your business, if at all.
