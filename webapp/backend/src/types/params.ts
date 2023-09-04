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

import {JSONType} from 'ajv';

/**
 * Handle google cloud workflow request types
 * @date 8/15/2023 - 9:39:06 PM
 *
 * @export
 * @interface WorkflowParams
 * @typedef {WorkflowParams}
 */
export interface WorkflowParams {
  projectId: string;
  workflowLocationId: string;
  tag?: string;
}

/**
 * Handle google cloud scheduler request types
 * @date 8/19/2023 - 9:39:47 PM
 *
 * @export
 * @interface JobSchedulerParams
 * @typedef {JobSchedulerParams}
 */
export interface JobSchedulerParams {
  projectId: string;
  jobSchedulerLocationId: string;
}

/**
 * To handle google cloud Bigquery parameters
 * @date 8/15/2023 - 9:40:27 PM
 *
 * @export
 * @interface BigqueryParams
 * @typedef {BigqueryParams}
 */
export interface BigqueryParams {
  projectId: string;
  datasetId: string;
  tableName: string;
}

/**
 * To handle google Cloud Storage parameters
 * @date 8/15/2023 - 9:46:04 PM
 *
 * @export
 * @interface CloudStorageParams
 * @typedef {CloudStorageParams}
 */
export interface CloudStorageParams {
  projectId: string;
  bucketName: string;
  fileName?: string;
  destFileName?: string;
  fileData?: JSONType;
}

/**
 * To handle google cloud Job Scheduler parameters
 * @date 8/15/2023 - 9:46:43 PM
 *
 * @export
 * @interface JobResourceParams
 * @typedef {JobResourceParams}
 */
export interface JobResourceParams {
  description: string;
  schedule: string;
  time_zone: string;
}

/**
 * List Columns of provided Table
 * @date 8/18/2023 - 12:34:50 PM
 *
 * @export
 * @interface TableColumnsList
 * @typedef {TableColumnsList}
 */
export interface TableColumnsList {
  columns: string[];
}

/**
 * Handle data set list returned by controller
 * @date 8/18/2023 - 3:15:38 PM
 *
 * @export
 * @interface DataSetList
 * @typedef {DataSetList}
 */
export interface DataSetList {
  datasetId: string;
  locationId: string;
}
