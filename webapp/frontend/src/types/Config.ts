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
 * Config type is supposed to hold
 * 3 main sections - Service account email,
 *  source related and log related table info
 * @date 9/1/2023 - 5:50:48 PM
 *
 * @export
 * @interface Config
 * @typedef {Config}
 */
export interface Config {
  service_account_email: string;
  source_table: SourceTable;
  log_table: LogTable;
}

/**
 * Source Table section consists of
 * project_id, dataset_id and table_name
 * @date 9/1/2023 - 5:55:17 PM
 *
 * @export
 * @interface SourceTable
 * @typedef {SourceTable}
 */
export interface SourceTable {
  project_id: string;
  dataset_id: string;
  table_name: string;
  n_tables_to_check?: number;
}

/**
 * Log Table section consists of
 * project_id, dataset_id and table_name
 * @date 9/1/2023 - 5:56:04 PM
 *
 * @export
 * @interface LogTable
 * @typedef {LogTable}
 */
export interface LogTable {
  project_id: string;
  dataset_id: string;
  table_name: string;
}

/**
 * Column section holds information about
 * type of parser applied on the column
 * and array of rules to checked for the column
 * @date 9/1/2023 - 5:56:27 PM
 *
 * @export
 * @interface Column
 * @typedef {Column}
 */
export interface Column {
  column_name: string;
  parser: string;
  rules: Rule[];
}

/**
 * Each parser can have 1 or more than one
 * rule. It holds name of the parser and
 * list of all rules in it
 * @date 9/1/2023 - 5:57:26 PM
 *
 * @export
 * @interface Parser
 * @typedef {Parser}
 */
export interface Parser {
  name: string;
  rules: Rule[];
}

/**
 * Rules consists of rule name
 * and list of arguments required
 * for the rule.
 * @date 9/1/2023 - 7:01:25 PM
 *
 * @export
 * @interface Rule
 * @typedef {Rule}
 */
export interface Rule {
  rule: string;
  args: Arg;
}

/**
 * It holds name of all the arguments
 * and corresponding value entered
 * @date 9/1/2023 - 7:02:45 PM
 *
 * @export
 * @interface Arg
 * @typedef {Arg}
 */
// export interface Arg {
//   name: string;
//   value: string;
// }

export interface Arg {
  [key: string]: unknown;
}

/**
 * To hold all the parameters required to read
 * config from google cloud bucket
 * with newConfig boolean flag, which indicates
 * whether it is a new config file or an
 * existing one
 * @date 9/1/2023 - 7:29:45 PM
 *
 * @export
 * @interface BucketPathProps
 * @typedef {BucketPathProps}
 */
export interface BucketPathProps {
  projectId: string;
  bucketId: string;
  fileName: string;
  newConfig: boolean;
  configFileList: string[];
}
