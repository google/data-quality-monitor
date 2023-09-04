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

/** Class for managing Google Cloud Workflows */

import {WorkflowsClient, ExecutionsClient} from '@google-cloud/workflows';
import {WorkflowParams} from '../../types/params';
import {
  IWorkflow,
  IListWorkflowsRequest,
  IListWorkflowsResponse,
  IExecution,
  ICreateExecutionRequest,
  IGetExecutionRequest,
} from '../../types/workflow-protos';

export default class WorkflowController {
  /**
   * Get list of workflows present in given project.
   *
   * There is an optional query parameter "tag"
   * If passed, it filters the result with matching
   * tags
   * Else returns all the workflows
   * @date 8/29/2023 - 3:12:55 PM
   *
   * @param {WorkflowParams} {
      projectId,
      workflowLocationId,
      tag = '',
    }
   * @returns {Promise<
      [IWorkflow[], IListWorkflowsRequest | null, IListWorkflowsResponse]
    >}
   */
  getWorkflowList({
    projectId,
    workflowLocationId,
    tag = '',
  }: WorkflowParams): Promise<
    [IWorkflow[], IListWorkflowsRequest | null, IListWorkflowsResponse]
  > {
    const client: WorkflowsClient = new WorkflowsClient({projectId});
    const parent = `projects/${projectId}/locations/${workflowLocationId}`;
    const filter = tag !== '' ? `labels.tag:${tag}` : '';
    const request = {parent, filter: filter};
    return client.listWorkflows(request);
  }

  /**
   * Trigger a workflow execution
   * @date 8/17/2023 - 11:28:05 AM
   *
   * @param {string} parent
   * @returns {Promise<
      [IExecution, ICreateExecutionRequest | undefined, {} | undefined]
    >}
   */
  executeWorkflow(
    parent: string
  ): Promise<
    [IExecution, ICreateExecutionRequest | undefined, {} | undefined]
  > {
    const client: ExecutionsClient = new ExecutionsClient();
    const execution = {};
    const request = {
      parent,
      execution,
    };
    return client.createExecution(request);
  }

  /**
   * Get all the executions for a Workflow
   * @date 8/17/2023 - 11:27:45 AM
   *
   * @async
   * @param {string} parent
   * @param {number} limit
   * @returns {Promise<IExecution[]>}
   */
  async getExecutions(parent: string, limit: number): Promise<IExecution[]> {
    const client: ExecutionsClient = new ExecutionsClient();
    const executions: IExecution[] = [];
    const response = client.listExecutionsAsync({
      parent,
      pageSize: 100,
    });
    let counter = 0;
    for await (const execution of response) {
      if (counter < limit) {
        executions.push(execution);
        counter = counter + 1;
      } else {
        break;
      }
    }
    return executions;
  }

  /**
   * Get execution details of a given Execution ID
   * @date 8/17/2023 - 11:26:02 AM
   *
   * @param {string} name
   * @returns {Promise<[IExecution, IGetExecutionRequest | undefined, {} | undefined]>}
   */
  getExecutionDetails(
    name: string
  ): Promise<[IExecution, IGetExecutionRequest | undefined, {} | undefined]> {
    const client: ExecutionsClient = new ExecutionsClient();
    const pageSize = 100;
    const request = {
      name,
      pageSize,
    };
    return client.getExecution(request);
  }
}
