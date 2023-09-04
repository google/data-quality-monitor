/**
Copyright 2023 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';

function AboutDQM() {
  return (
    <React.Fragment>
      <Title>Data Quality Monitor</Title>

      <Typography component={'p'} variant="body2">
        <p>
          Data is the most important part of a modern business strategy.
          However, it's hard to maintain the robust foundation necessary for
          supporting data-driven decisions.
        </p>
        <p>
          DQM checks the data based on rules specified by you in a{' '}
          <a
            href="https://github.com/google/data-quality-monitor/blob/main/deployment/config_template.json"
            target="_blank"
          >
            JSON template.
          </a>{' '}
          Maintaining this template manually is a challenging and prone to human
          error.
        </p>
        <p>
          DQM Webapp aims to empower you with an easy way to configure the above
          JSON template. By utilizing our frontend interface to set up and
          manage your DQM configurations, you minimize the risk of human errors.
          Note that, configuration form is dynamically generated based on rules
          configured.
        </p>
        <p>
          Additionally, our platform offers you the ability to manage, execute
          and schedule the DQM workflow deployed during the DQM deployment. DQM
          Webapp allow you to view log of all the rule violations caused in your
          provided database.
        </p>
      </Typography>
    </React.Fragment>
  );
}

export default AboutDQM;
