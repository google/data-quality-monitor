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

/** Routes for all endpoints related to Google Cloud Job scheduler */

import express from 'express';
import JobController from '../../../controllers/v1/job-scheduler';
import {JobSchedulerParams, JobResourceParams} from '../../../types/params';

const v1_job_routes = express.Router();

v1_job_routes.get(
  '/projects/:projectId/jobs/:jobSchedulerLocationId',
  async (req, res) => {
    //  #swagger.tags=['Job Scheduler']
    try {
      const controller = new JobController();
      const props: JobSchedulerParams = {...req.params};
      const response = await controller.getJobsList(props);
      return res.send(response);
    } catch (errors) {
      res.send({errors});
    }
  }
);

v1_job_routes.get('/jobs/:name/info', async (req, res) => {
  //  #swagger.tags=['Job Scheduler']
  try {
    const controller = new JobController();
    const response = await controller.getJobInfo(req.params.name);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

v1_job_routes.put('/jobs/:name/update', async (req, res) => {
  //  #swagger.tags=['Job Scheduler']
  try {
    const controller = new JobController();
    const resources: JobResourceParams = req.body || '';
    const response = await controller.updateJobInfo(req.params.name, resources);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

v1_job_routes.delete('/jobs/:name/delete', async (req, res) => {
  //  #swagger.tags=['Job Scheduler']
  try {
    const controller = new JobController();
    const response = await controller.deleteJob(req.params.name);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

v1_job_routes.post('/jobs/:name/pause', async (req, res) => {
  //  #swagger.tags=['Job Scheduler']
  try {
    const controller = new JobController();
    const response = await controller.pauseJob(req.params.name);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

v1_job_routes.post('/jobs/:name/resume', async (req, res) => {
  //  #swagger.tags=['Job Scheduler']
  try {
    const controller = new JobController();
    const response = await controller.resumeJob(req.params.name);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

export default v1_job_routes;
