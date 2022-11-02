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
from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime
from enum import Enum
from typing import Any, List, Sequence, cast

from typing_extensions import TypedDict

from core.auth import AuthConfig, get_credentials
from core.bigquery import (BigQueryLegacyClient, TableMetadata, build_table_id,
                           get_bq_legacy_client, get_formatted_timestamp)


class LogMessage(TypedDict, total=False):
    """
    Represents the log message data
    """
    # Common fields
    dqm_version_id: str
    workflow_execution_id: str
    run_timestamp_utc: str

    project_id: str
    dataset_id: str
    table_name: str
    full_table_id: str

    # Per-log fields
    log_type: str

    column: str
    error: str
    parser: str
    rule: str
    rule_params: dict
    value: str


class LogType(Enum):
    SYSTEM = "system"
    PARSER = "parser"
    RULE = "rule"


class Logger(ABC):
    """
    Logger class containing the base log messages that can be populated with
    error message data to be printed.
    """

    _base_log: LogMessage = {}
    _batch_size: int

    DEFAULT_BATCH_SIZE: int

    _messages: List[LogMessage] = []

    def __init__(self, batch_size: int | None = None) -> None:
        self._batch_size = batch_size or self.DEFAULT_BATCH_SIZE

    def set_base_log(self, dqm_version_id: str, workflow_execution_id: str,
                     table_metadata: TableMetadata,
                     run_dt_utc: datetime) -> None:
        """
        Set the common values for each log message.

        Args:
            * dqm_version_id: DQM version ID
            * workflow_execution_id: Workflow execution ID
            * table_metadata: Source TableMetadata
            * run_dt_utc: UTC timestamp object

        Returns:
            * None
        """

        self._base_log = LogMessage(
            dqm_version_id=dqm_version_id,
            workflow_execution_id=workflow_execution_id,
            project_id=table_metadata['project_id'],
            dataset_id=table_metadata['dataset_id'],
            table_name=table_metadata['table_name'],
            full_table_id=build_table_id(table_metadata),
            run_timestamp_utc=get_formatted_timestamp(run_dt_utc))

    def queue_log_message(self, message: LogMessage) -> None:
        """
        Add a log message to the log queue.

        Args:
            * message: LogMessage dictionary

        Returns:
            * None
        """
        self._messages.append(message)

    def flush(self, force: bool = False) -> bool:
        """
        Checks the current log message queue size and sends them all,
        if the set limit has been reached.

        Args:
            * force: Flush even if the queue is below the size limit

        Returns:
            * Whether a flush occurred or not
        """
        if (len(self._messages) >= self._batch_size) or force:
            self.send_log_messages(self._messages)
            self._messages = []
            return True
        else:
            return False

    @abstractmethod
    def send_log_messages(self, messages: List[LogMessage]) -> None:
        """
        Sends multiple log messages to be handled.

        Args:
            * messages: list of LogMessage dictionaries

        Returns:
            * None
        """
        pass

    @abstractmethod
    def send_log_message(self, message: LogMessage) -> None:
        """
        Sends a log message to be handled.

        Args:
            * message: LogMessage dictionary

        Returns:
            * None
        """
        pass

    def _build_system_message(self, error: str) -> LogMessage:
        """
        Adds system error information to base log message.

        Args:
            * error: error that occurred

        Returns:
            * Log - dictionary containing log data
        """
        return self._base_log.copy() | LogMessage(
            log_type=LogType.SYSTEM.value,
            error=error,
        )

    def _build_parser_message(self, column: str, parser: str,
                              value: Any) -> LogMessage:
        """
        Adds parser error information to base log message.

        Args:
            * column: column where the rule is applied
            * parser: parser function that failed and raises this message
            * value: value that fails to parse

        Returns:
            * log: LogMessage dictionary
        """
        return self._base_log.copy() | LogMessage(log_type=LogType.PARSER.value,
                                                  column=column,
                                                  parser=parser,
                                                  value=value)

    def _build_rule_message(self,
                            column: str,
                            rule: str,
                            value: Any,
                            rule_params: dict = {}) -> LogMessage:
        """
        Adds rule error information to base log message.

        Args:
            * column: column where the rule is applied
            * rule: rule that is violated and raises this message
            * value: value that violates the rule
            * rule_params: optional, parameters set for the rule

        Returns:
            * log: LogMessage dictionary
        """
        return self._base_log.copy() | LogMessage(
            log_type=LogType.RULE.value,
            column=column,
            rule=rule,
            rule_params=rule_params,
            value=value,
        )

    def system(self, error: str) -> None:
        """
        Adds system error information to base log message and
        sends it to the logger for writing.

        Args:
            * error: error that occurred

        Returns:
            * None
        """

        log = self._build_system_message(error)
        self.queue_log_message(log)

    def parser(self, column: str, parser: str, value: Any) -> None:
        """
        Adds parser error information to base log message and
        sends it to the logger for writing.

        Args:
            * column: column where the rule is applied
            * parser: parser function that failed and raises this message
            * value: value that fails to parse

        Returns:
            * None
        """

        log = self._build_parser_message(column, parser, value)
        self.queue_log_message(log)

    def rule(self,
             column: str,
             rule: str,
             value: Any,
             rule_params: dict = {}) -> None:
        """
        Adds rule error information to base log message and
        sends it to the logger for writing.

        Args:
            * column: column where the rule is applied
            * rule: rule that is violated and raises this message
            * value: value that violates the rule
            * rule_params: optional, parameters set for the rule

        Returns:
            * None
        """

        log = self._build_rule_message(column, rule, value, rule_params)
        self.queue_log_message(log)


class PrintLogger(Logger):

    DEFAULT_BATCH_SIZE = 10

    def send_log_messages(self, messages: List[LogMessage]) -> None:
        """
        Prints multiple log messages to be captured by cloud logging.

        Args:
            * messages: list of LogMessage dictionaries

        Returns:
            * None
        """
        for message in messages:
            self.send_log_message(message)

    def send_log_message(self, message: LogMessage) -> None:
        """
        Prints the log message to be captured by cloud logging.

        Args:
            * message: LogMessage dictionary

        Returns:
            * None
        """
        print(message)


class BigQueryLogger(Logger):

    DEFAULT_BATCH_SIZE = 1000

    _bq_client: BigQueryLegacyClient
    _table_id: str

    def __init__(self,
                 table_metadata: TableMetadata,
                 auth_config: AuthConfig | None = None,
                 batch_size: int | None = None) -> None:
        self._table_id = build_table_id(table_metadata)

        credentials = get_credentials(auth_config)
        self._bq_client = get_bq_legacy_client(table_metadata['project_id'],
                                               credentials)

        return super().__init__(batch_size)

    def send_log_messages(self, messages: List[LogMessage]) -> None:
        """
        Sends multiple log messages to BigQuery.

        Args:
            * messages: list of LogMessage dictionaries

        Returns:
            * None
        """
        self._bq_client.insert_rows_json(self._table_id,
                                         cast(Sequence[dict], messages))

    def send_log_message(self, message: LogMessage) -> None:
        """
        Sends the log message to BigQuery.

        Args:
            * message: LogMessage dictionary

        Returns:
            * None
        """
        self.send_log_messages([message])
