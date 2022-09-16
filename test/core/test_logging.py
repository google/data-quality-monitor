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

import unittest
from typing import Any

from core.logging import Logger


class LoggerTest(unittest.TestCase):

    def setUp(self):
        table_id = '01_01_1980_export'
        project_id = 'test_project'
        dataset_id = "test_dataset"
        self.test_log: dict[str, Any] = {
            "project_id":
                project_id,
            "dqm_instance_id":
                '123456',
            "dqm_execution_id":
                '1663318447740',
            "dataset_id":
                dataset_id,
            "log_type":
                'DV360',
            "full_table_id":
                "projects/test_project/datasets/test_dataset/tables" +
                "/01_01_1980_export",
            "run_timestamp":
                '01_01_1980',
        }
        self.logger = Logger(self.test_log['project_id'],
                             self.test_log['dqm_instance_id'],
                             self.test_log['dqm_execution_id'],
                             self.test_log['log_type'],
                             self.test_log['dataset_id'], table_id,
                             self.test_log['run_timestamp'])
        return super().setUp()

    def test_initilization(self):
        # verifies if the test_log dict has been properly stored in the logger
        self.assertEqual(self.logger.base_log, self.test_log)

    def test_construct_log_message(self):
        # test if detailed log message information is added and returned.
        column = 'name'
        rule = 'isName'
        value = 'not_a_name'
        self.test_log['column'] = column
        self.test_log['rule'] = rule
        self.test_log['value'] = value
        self.test_log['rule_params'] = {}  # expect empty dict if no params
        self.assertEqual(self.logger.construct_log_message(column, rule, value),
                         self.test_log)

        # add parameters
        params = {"min": 0, "max": 10}
        self.test_log['rule_params'] = params
        self.assertEqual(
            self.logger.construct_log_message(column,
                                              rule,
                                              value,
                                              rule_params=params),
            self.test_log)
