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

/** Class for managing Google Cloud - Storage client */

import {
  Storage,
  GetFilesResponse,
  Bucket,
  File,
  DownloadResponse,
  DeleteFileResponse,
  MoveResponse,
} from '@google-cloud/storage';
import {CloudStorageParams} from '../../types/params';

export default class ConfigController {
  /**
   * Returns an array of names of all files found
   * in given bucket
   * @date 8/16/2023 - 5:06:49 PM
   *
   * @async
   * @param {CloudStorageParams} {
      projectId,
      bucketName,
    }
   * @returns {Promise<string[]>}
   */
  async getAllFiles({
    projectId,
    bucketName,
  }: CloudStorageParams): Promise<string[]> {
    const storage = new Storage({projectId});
    const bucket: Bucket = storage.bucket(bucketName);
    const [files]: GetFilesResponse = await bucket.getFiles();
    const fileNames: string[] = [];
    files.map(item => {
      fileNames.push(bucket.file(item.name).name);
    });
    return fileNames;
  }

  /**
   * Returns JSON content of the file provided as
   * input parameter
   * @date 8/16/2023 - 5:07:39 PM
   *
   * @async
   * @param {CloudStorageParams} {
      projectId,
      bucketName,
      fileName,
    }
   * @returns {Promise<JSON>}
   */
  async readConfigFromBucket({
    projectId,
    bucketName,
    fileName,
  }: CloudStorageParams): Promise<JSON> {
    const storage = new Storage({projectId});
    const bucket: Bucket = storage.bucket(bucketName);
    const file: File = bucket.file(fileName || '');
    const [data]: DownloadResponse = await file.download();
    return JSON.parse(data.toString());
  }

  /**
   * Writes the Json content in the file name
   * provided as input
   * Note:
   * If file name exists
   *  - It overrides the existing data with new data
   * If file name does not exist
   *  - It creates a new file with provided data in same bucket
   * @date 8/16/2023 - 5:08:20 PM
   *
   * @async
   * @param {CloudStorageParams} {
      projectId,
      bucketName,
      fileName,
      fileData,
    }
   * @returns {Promise<void>}
   */
  async writeConfigToBucket({
    projectId,
    bucketName,
    fileName,
    fileData,
  }: CloudStorageParams): Promise<void> {
    const storage = new Storage({projectId});
    const bucket: Bucket = await storage.bucket(bucketName);
    const file: File = bucket.file(fileName || '');
    const jsonData = JSON.stringify(fileData || {}, null, 2);

    return file.save(jsonData, {
      contentType: 'application/json',
      resumable: false, // Set to to true if file is bigger
    });
  }

  /**
   * Deletes the file from bucket permanently
   * @date 8/18/2023 - 12:24:57 PM
   *
   * @param {CloudStorageParams} {
      projectId,
      bucketName,
      fileName,
    }
   * @returns {Promise<DeleteFileResponse>}
   */
  deleteConfigFileFromBucket({
    projectId,
    bucketName,
    fileName,
  }: CloudStorageParams): Promise<DeleteFileResponse> {
    const storage = new Storage({projectId});
    const bucket: Bucket = storage.bucket(bucketName);
    const file: File = bucket.file(fileName || '');
    return file.delete();
  }

  /**
   * To rename the _DRAFT_ config file to
   * final version of file
   * @date 8/29/2023 - 4:49:14 PM
   *
   * @async
   * @param {CloudStorageParams} {
      projectId,
      bucketName,
      fileName,
      destFileName,
    }
   * @returns {Promise<MoveResponse>}
   */
  async renameConfigFileNameInTheBucket({
    projectId,
    bucketName,
    fileName,
    destFileName,
  }: CloudStorageParams): Promise<MoveResponse> {
    const storage = new Storage({projectId});
    const bucket: Bucket = await storage.bucket(bucketName);
    const file: File = bucket.file(fileName || '');
    const destFile: File = bucket.file(destFileName || '');
    return await file.rename(destFile);
  }
}
