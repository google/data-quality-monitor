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

/** Class for managing Google Cloud Scheduled Jobs */

import {CloudSchedulerClient} from '@google-cloud/scheduler/';
import {JobSchedulerParams, JobResourceParams} from '../../types/params';
import {
  IJob,
  IGetJobRequest,
  IUpdateJobRequest,
  IDeleteJobRequest,
  IPauseJobRequest,
  IResumeJobRequest,
  IEmpty,
  IFieldMask,
} from '../../types/scheduler-protos';

export default class JobController {
  /**
   * Get the list of all Scheduler Jobs
   * @date 8/17/2023 - 11:05:29 AM
   *
   * @param {GCBasicParams} {projectId, jobSchedulerLocationId}
   * @returns {Promise<IJob[]>}
   */
  async getJobsList({
    projectId,
    jobSchedulerLocationId,
  }: JobSchedulerParams): Promise<IJob[]> {
    const client: CloudSchedulerClient = new CloudSchedulerClient({
      projectId,
    });
    const parent = `projects/${projectId}/locations/${jobSchedulerLocationId}`;
    const [response] = await client.listJobs({parent});
    return response;
  }

  /**
   * Get details about a scheduled Job
   * @date 8/17/2023 - 11:01:06 AM
   *
   * @param {string} name
   * @returns {Promise<[IJob, IGetJobRequest | undefined, {} | undefined]>}
   */
  getJobInfo(
    name: string
  ): Promise<[IJob, IGetJobRequest | undefined, {} | undefined]> {
    const client: CloudSchedulerClient = new CloudSchedulerClient();
    const request = {name};
    return client.getJob(request);
  }

  /**
   * Modify a Scheduled Job
   * Note: Allowed to modify, Description, Schedule and TimeZone
   * @date 8/17/2023 - 10:59:37 AM
   *
   * @param {string} name
   * @param {JobResourceParams} resources
   * @returns {Promise<[IJob, IUpdateJobRequest | undefined, {} | undefined]>}
   */
  updateJobInfo(
    name: string,
    resources: JobResourceParams
  ): Promise<[IJob, IUpdateJobRequest | undefined, {} | undefined]> {
    const client: CloudSchedulerClient = new CloudSchedulerClient();
    const updateMask: IFieldMask = {paths: [...Object.keys(resources)]};
    const job: IJob = {
      name: name,
      description: resources.description,
      schedule: resources.schedule,
      timeZone: resources.time_zone,
    };
    const request: IUpdateJobRequest = {
      updateMask,
      job,
    };
    return client.updateJob(request);
  }

  /**
   * Delete an existing Job
   * @date 8/17/2023 - 10:59:18 AM
   *
   * @param {string} name
   * @returns {Promise<[IEmpty, IDeleteJobRequest | undefined, {} | undefined]>}
   */
  deleteJob(
    name: string
  ): Promise<[IEmpty, IDeleteJobRequest | undefined, {} | undefined]> {
    const client: CloudSchedulerClient = new CloudSchedulerClient();
    const request = {name};
    return client.deleteJob(request);
  }

  /**
   * Pause an existing Job
   * @date 8/17/2023 - 11:06:47 AM
   *
   * @param {string} name
   * @returns {Promise<[IJob, IPauseJobRequest | undefined, {} | undefined]>}
   */
  pauseJob(
    name: string
  ): Promise<[IJob, IPauseJobRequest | undefined, {} | undefined]> {
    const client: CloudSchedulerClient = new CloudSchedulerClient();
    const request = {name};
    return client.pauseJob(request);
  }

  /**
   * Resume an existing Job
   * @date 8/17/2023 - 10:56:42 AM
   *
   * @async
   * @param {string} name
   * @returns {Promise<[IJob, IResumeJobRequest | undefined, {} | undefined]>}
   */
  resumeJob(
    name: string
  ): Promise<[IJob, IResumeJobRequest | undefined, {} | undefined]> {
    const client: CloudSchedulerClient = new CloudSchedulerClient();
    const request = {name};
    return client.resumeJob(request);
  }
}
