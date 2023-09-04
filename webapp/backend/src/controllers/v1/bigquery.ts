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

/** Class for managing Google Cloud - Bigquery client */

import {
  BigQuery,
  SimpleQueryRowsResponse,
  DatasetsResponse,
  GetTablesResponse,
  RowMetadata,
} from '@google-cloud/bigquery';
import {BigqueryParams, TableColumnsList} from '../../types/params';

export default class BigQueryController {
  /**
   * Get list of Dataset ids for a given project
   * @date 8/18/2023 - 4:07:00 PM
   *
   * @async
   * @param {string} projectId
   * @returns {Promise<string[]>}
   */
  async getDataSetList(projectId: string): Promise<string[]> {
    const bigquery = new BigQuery({projectId});
    const [dataSets]: DatasetsResponse = await bigquery.getDatasets();
    const dataSetNameList: string[] = [];
    dataSets &&
      dataSets.map(item => {
        dataSetNameList.push(item.metadata.datasetReference.datasetId);
      });

    return dataSetNameList;
  }

  /**
   * Get list of tables present in given dataset
   *
   * There is an optional query parameter "tag"
   * If passed, it filters the result with matching
   * tags
   * Else returns all the tables
   * @date 8/19/2023 - 4:26:49 PM
   *
   * @async
   * @param {string} projectId
   * @param {string} datasetId
   * @param {string} [tag='']
   * @returns {Promise<string[]>}
   */
  async getTablesList(
    projectId: string,
    datasetId: string,
    tag = ''
  ): Promise<string[]> {
    const bigquery = new BigQuery({projectId});
    const [tables]: GetTablesResponse = await bigquery
      .dataset(datasetId)
      .getTables();

    const tableNameList: string[] = tables
      .filter(
        table =>
          tag === 'undefined' ||
          (table.metadata?.labels?.tag?.includes(tag) && tag !== 'undefined')
      )
      .map(table => table.metadata?.tableReference?.tableId || '');

    return tableNameList;
  }

  /**
   * Get all the records from Logs table
   * @date 8/16/2023 - 2:17:02 PM
   *
   * @async
   * @param {BigqueryParams} {
      projectId,
      datasetLocationId,
      datasetId,
      tableName,
    }
   * @returns {Promise<SimpleQueryRowsResponse[]>}
   */
  async getLogs({
    projectId,
    datasetId,
    tableName,
  }: BigqueryParams): Promise<SimpleQueryRowsResponse[]> {
    const bigquery: BigQuery = new BigQuery({projectId});
    const [dataset] = await bigquery.dataset(datasetId).get();
    const datasetLocationId = dataset.metadata.location;
    const sqlQuery = `SELECT * FROM \`${projectId}.${datasetId}.${tableName}\``;
    const options = {
      query: sqlQuery,
      location: datasetLocationId,
    };
    const [rows]: SimpleQueryRowsResponse = await bigquery.query(options);
    return rows;
  }

  /**
   * Returns list of column names for a given table name from bigquery
   * @date 8/16/2023 - 4:45:56 PM
   *
   * @async
   * @param {BigqueryParams} {
      projectId,
      datasetLocationId,
      datasetId,
      tableName,
    }
   * @returns {Promise<TableColumnsList>}
   */
  async getColumns({
    projectId,
    datasetId,
    tableName,
  }: BigqueryParams): Promise<TableColumnsList> {
    const bigquery: BigQuery = new BigQuery({projectId});
    const [dataset] = await bigquery.dataset(datasetId).get();
    const datasetLocationId = dataset.metadata.location;
    const sqlQuery = `SELECT COLUMN_NAME FROM ${projectId}.${datasetId}.INFORMATION_SCHEMA.COLUMNS WHERE table_name= "${tableName}"`;
    const options = {
      query: sqlQuery,
      location: datasetLocationId,
    };
    const [columnJson]: SimpleQueryRowsResponse = await bigquery.query(options);
    return this.getColumnArray(columnJson);
  }

  /**
   * Create a Json with Columns as key
   * and array of all column names as its value
   * @date 8/17/2023 - 12:00:03 AM
   *
   * @param {SimpleQueryRowsResponse[]} columnJson
   * @returns {TableColumnsList}
   */
  getColumnArray(columnJson: SimpleQueryRowsResponse[]): TableColumnsList {
    const columnsList: TableColumnsList = {columns: []};
    columnJson.map((col: RowMetadata) => {
      columnsList.columns.push(col.COLUMN_NAME);
    });
    return columnsList;
  }
}
