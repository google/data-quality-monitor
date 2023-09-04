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

import schedulerProtos from '@google-cloud/scheduler/build/protos/protos';

export type IListJobsResponse =
  schedulerProtos.google.cloud.scheduler.v1.IListJobsResponse;

export type IJob = schedulerProtos.google.cloud.scheduler.v1.IJob;

export type IListJobsRequest =
  schedulerProtos.google.cloud.scheduler.v1.IListJobsRequest;

export type IGetJobRequest =
  schedulerProtos.google.cloud.scheduler.v1.IGetJobRequest;

export type IUpdateJobRequest =
  schedulerProtos.google.cloud.scheduler.v1.IUpdateJobRequest;

export type IDeleteJobRequest =
  schedulerProtos.google.cloud.scheduler.v1.IDeleteJobRequest;

export type IPauseJobRequest =
  schedulerProtos.google.cloud.scheduler.v1.IPauseJobRequest;

export type IResumeJobRequest =
  schedulerProtos.google.cloud.scheduler.v1.IResumeJobRequest;

export type IEmpty = schedulerProtos.google.protobuf.IEmpty;

export type IFieldMask = schedulerProtos.google.protobuf.IFieldMask;
