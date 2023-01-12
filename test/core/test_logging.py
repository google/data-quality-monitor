"""
Copyright 2022 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from datetime import datetime
import json
from typing import Any
import unittest

from core.bigquery import TableMetadata
from core.logging import PrintLogger


class PrintLoggerTest(unittest.TestCase):

    def setUp(self):

        dqm_version_id = '1.0.0'
        workflow_execution_id = '1234567890'
        run_timestamp_utc = '2022-10-20T10:30:20.000001'

        project_id = 'test_project'
        dataset_id = 'test_dataset'
        table_name = '01_01_1980_export'

        table_metadata = TableMetadata(project_id=project_id,
                                       dataset_id=dataset_id,
                                       table_name=table_name)
        full_table_id = f"{project_id}.{dataset_id}.{table_name}"

        self.test_log: dict[str, Any] = {
            "dqm_version_id": dqm_version_id,
            "workflow_execution_id": workflow_execution_id,
            "run_timestamp_utc": run_timestamp_utc,
            "project_id": project_id,
            "dataset_id": dataset_id,
            "table_name": table_name,
            "full_table_id": full_table_id
        }

        self.logger = PrintLogger()
        self.logger.set_base_log(
            dqm_version_id, workflow_execution_id, table_metadata,
            datetime.fromisoformat(self.test_log['run_timestamp_utc']))

        return super().setUp()

    def test_initilization(self):
        # verifies if the test_log dict has been properly stored in the logger
        self.assertEqual(self.logger._base_log, self.test_log)

    def test_build_system_message(self):
        error = 'Something went wrong!'
        self.test_log['log_type'] = 'system'
        self.test_log['error'] = error

        self.assertEqual(self.logger._build_system_message(error),
                         self.test_log)

    def test_build_parser_message(self):
        column = 'name'
        parser = 'parse_int'
        error = 'Not an int.'
        value = 'not_a_name'

        self.test_log['log_type'] = 'parser'
        self.test_log['column'] = column
        self.test_log['parser'] = parser
        self.test_log['error'] = error
        self.test_log['value'] = value

        self.assertEqual(
            self.logger._build_parser_message(column, parser, error, value),
            self.test_log)

    def test_build_rule_message(self):
        column = 'name'
        rule = 'isName'
        error = 'Not a name.'
        value = 'not_a_name'

        self.test_log['log_type'] = 'rule'
        self.test_log['column'] = column
        self.test_log['rule'] = rule
        self.test_log['error'] = error
        self.test_log['value'] = value
        self.test_log['rule_params'] = '{}'  # expect empty dict if no params

        self.assertEqual(
            self.logger._build_rule_message(column, rule, error, value),
            self.test_log)

        # add parameters

        params = {"min": 0, "max": 10}

        self.test_log['rule_params'] = json.dumps(params)

        self.assertEqual(
            self.logger._build_rule_message(column,
                                            rule,
                                            error,
                                            value,
                                            rule_params=params), self.test_log)

    def test_build_rule_message_string_params(self):
        column = 'name'
        rule = 'isName'
        error = 'Not a name.\n'
        value = 'not_a_name\n'
        params = {"regex": "test.*\n"}

        self.test_log['log_type'] = 'rule'
        self.test_log['column'] = column
        self.test_log['rule'] = rule
        self.test_log['error'] = error
        self.test_log['value'] = value
        self.test_log['rule_params'] = json.dumps(params)

        self.assertEqual(
            self.logger._build_rule_message(column,
                                            rule,
                                            error,
                                            value,
                                            rule_params=params), self.test_log)
