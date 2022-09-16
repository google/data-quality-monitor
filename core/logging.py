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

from typing import Any

from pydantic import BaseModel

from .bigquery import TableMetadata, build_table_path


class LogMessage(BaseModel):
    """
    Represents the log message data
    """
    project_id: str
    dqm_instance_id: str
    dqm_execution_id: str
    dataset_id: str
    log_type: str
    full_table_id: str
    run_timestamp: str
    column: str
    rule: str
    rule_params: dict
    value: str


class Logger:
    """
    Logger class containing the base log messages that can be populated with
    error message data to be printed.
    """

    def __init__(self, project_id: str, dqm_instance_id: str,
                 dqm_execution_id: str, log_type: str, dataset_id: str,
                 table_id: str, run_timestamp: str):

        table_meta_data = TableMetadata(
            **{
                "project_id": project_id,
                "dataset_id": dataset_id,
                "table_name": table_id,
            })

        self.base_log = {
            "project_id": project_id,
            "dqm_instance_id": dqm_instance_id,
            "dqm_execution_id": dqm_execution_id,
            "dataset_id": dataset_id,
            "log_type": log_type,
            "full_table_id": build_table_path(table_meta_data),
            "run_timestamp": run_timestamp,
        }

    def send_log_message(self, column: str, rule: str, value: Any,
                         rule_params: dict) -> None:
        """
        Adds error/violation information to base log message and prints it to
        be captured by cloud logging.

        Args:
            * column: column where the rule is applied
            * rule: rule that is violated and raises this message
            * rule_params: optional, parameters set for the rule
            * value: value that violates the rule

        Returns:
            * None
        """

        log = self.construct_log_message(column, rule, value, rule_params)
        self.print_log_message(log)

    def construct_log_message(self,
                              column: str,
                              rule: str,
                              value: Any,
                              rule_params: dict = {}) -> LogMessage:
        """
        Adds error/violation information to base log message

        Args:
            * column: column where the rule is applied
            * rule: rule that is violated and raises this message
            * rule_params: optional, parameters set for the rule
            * value: value that violates the rule

        Returns:
            * Log; dictionary contraining log data
        """

        log = LogMessage(
            **self.base_log | {
                "column": column,
                "rule": rule,
                "rule_params": rule_params,
                "value": value,
            })
        return log

    def print_log_message(self, message: dict) -> None:
        """
        Prints the log message to be captured by cloud logging

        Args:
            * message: dictionary containg all log information

        Returns:
            * None
        """
        print(message)
