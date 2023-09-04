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

/** Routes for all endpoints related to Google Cloud Workflows */

import express from 'express';
import WorkflowController from '../../../controllers/v1/workflow';
import {WorkflowParams} from '../../../types/params';

const v1_workflow_routes = express.Router();

v1_workflow_routes.get(
  '/projects/:projectId/workflows/:workflowLocationId',
  async (req, res) => {
    //  #swagger.tags=['Workflows']
    try {
      const props: WorkflowParams = {
        projectId: req.params.projectId,
        workflowLocationId: req.params.workflowLocationId,
        tag: (req.query.tag && String(req.query.tag)) || '',
      };
      const controller = new WorkflowController();
      const response = await controller.getWorkflowList(props);
      return res.send(response);
    } catch (errors) {
      res.send({errors});
    }
  }
);

v1_workflow_routes.post('/workflow/:parent/execute', async (req, res) => {
  //  #swagger.tags=['Workflows']
  try {
    const controller = new WorkflowController();
    const response = await controller.executeWorkflow(req.params.parent);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

v1_workflow_routes.get('/workflow/:parent/executions', async (req, res) => {
  //  #swagger.tags=['Workflows']
  let limit = Number(req.query.limit);
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  }
  try {
    const controller = new WorkflowController();
    const response = await controller.getExecutions(req.params.parent, limit);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

v1_workflow_routes.get('/workflow/:name/execution/info', async (req, res) => {
  //  #swagger.tags=['Workflows']
  try {
    const controller = new WorkflowController();
    const response = await controller.getExecutionDetails(req.params.name);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

export default v1_workflow_routes;
