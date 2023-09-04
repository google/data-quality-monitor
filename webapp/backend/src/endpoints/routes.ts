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

/** Parent route for health check etc. */

import express from 'express';
import v1_job_routes from './v1/routes/job-scheduler';
import v1_workflow_routes from './v1/routes/workflow';
import v1_bigquery_routes from './v1/routes/bigquery';
import v1_config_routes from './v1/routes/config-file';

const router = express.Router();

router.use('/api/v1', v1_job_routes);
router.use('/api/v1', v1_workflow_routes);
router.use('/api/v1', v1_bigquery_routes);
router.use('/api/v1', v1_config_routes);

export default router;
