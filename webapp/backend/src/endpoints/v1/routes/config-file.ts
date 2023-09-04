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

/**
 * Routes for all endpoints related to Google Cloud Storage Bucket
 * To handle Create, Update and Delete - Config Files
*/

import express = require('express');
import ConfigController from '../../../controllers/v1/cloud-storage';
import {CloudStorageParams} from '../../../types/params';

const v1_config_routes = express.Router();

v1_config_routes.get(
  '/projects/:projectId/buckets/:bucketName/configs',
  async (req, res) => {
    //  #swagger.tags=['Config File']
    try {
      const controller = new ConfigController();
      const props: CloudStorageParams = {...req.params};
      const data = await controller.getAllFiles(props);
      return res.send(data);
    } catch (errors) {
      res.send({errors});
    }
  }
);

v1_config_routes.get(
  '/projects/:projectId/buckets/:bucketName/files/:fileName',
  async (req, res) => {
    //  #swagger.tags=['Config File']
    try {
      const controller = new ConfigController();
      const props: CloudStorageParams = {...req.params};
      const data = await controller.readConfigFromBucket(props);
      return res.send(data);
    } catch (errors) {
      res.send({errors});
    }
  }
);

v1_config_routes.post(
  '/projects/:projectId/buckets/:bucketName/files/:fileName',
  async (req, res) => {
    //  #swagger.tags=['Config File']
    try {
      const fileData = req.body;
      const props: CloudStorageParams = {...req.params, fileData};
      const controller = new ConfigController();
      const data = await controller.writeConfigToBucket(props);
      return res.send(data);
    } catch (errors) {
      res.send({errors});
    }
  }
);

v1_config_routes.delete(
  '/projects/:projectId/buckets/:bucketName/files/:fileName',
  async (req, res) => {
    //  #swagger.tags=['Config File']
    try {
      const props: CloudStorageParams = {...req.params};
      const controller = new ConfigController();
      const data = await controller.deleteConfigFileFromBucket(props);
      return res.send(data);
    } catch (errors) {
      res.send({errors});
    }
  }
);

v1_config_routes.post(
  '/projects/:projectId/buckets/:bucketName/files/:fileName/rename/:destFileName',
  async (req, res) => {
    //  #swagger.tags=['Config File']
    try {
      const props: CloudStorageParams = {...req.params};
      const controller = new ConfigController();
      const data = await controller.renameConfigFileNameInTheBucket(props);
      return res.send(data);
    } catch (errors) {
      res.send({errors});
    }
  }
);

export default v1_config_routes;
