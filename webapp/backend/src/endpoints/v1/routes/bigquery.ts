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

/** Routes for all endpoints related to Google Cloud Bigquery */

import express from 'express';
import BigQueryController from '../../../controllers/v1/bigquery';
import {BigqueryParams} from '../../../types/params';

const v1_bigquery_routes = express.Router();

v1_bigquery_routes.get('/projects/:projectId/datasets', async (req, res) => {
  //  #swagger.tags=['Logs']
  const controller = new BigQueryController();
  try {
    const response = await controller.getDataSetList(req.params.projectId);
    return res.send(response);
  } catch (errors) {
    res.send({errors});
  }
});

v1_bigquery_routes.get(
  '/projects/:projectId/datasets/:datasetId/tables',
  async (req, res) => {
    //  #swagger.tags=['Logs']
    const controller = new BigQueryController();
    try {
      const response = await controller.getTablesList(
        req.params.projectId,
        req.params.datasetId,
        String(req.query.tag)
      );
      return res.send(response);
    } catch (errors) {
      res.send({errors});
    }
  }
);


v1_bigquery_routes.get(
  '/projects/:projectId/datasets/:datasetId/tables/:tableName/columns',
  async (req, res) => {
    //  #swagger.tags=['Logs']
    const props: BigqueryParams = {...req.params};
    const controller = new BigQueryController();
    const response = await controller.getColumns(props);
    return res.send(response);
  }
);

v1_bigquery_routes.get(
  '/projects/:projectId/datasets/:datasetId/tables/:tableName/logs',
  async (req, res) => {
    //  #swagger.tags=['Logs']
    const props: BigqueryParams = {...req.params};
    const controller = new BigQueryController();
    try {
      const response = await controller.getLogs(props);
      return res.send(response);
    } catch (errors) {
      res.send({errors});
    }
  }
);

export default v1_bigquery_routes;
