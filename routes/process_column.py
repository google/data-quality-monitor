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

from typing import Any, Mapping, Optional

from pydantic import BaseModel

from core.auth import AuthConfig, get_credentials
from core.bigquery import (TableMetadata, get_bq_storage_read_client,
                           get_readrows_iterator)
from core.config import ColumnConfig, generate_selected_rules
from core.http import DQMResponse
from rules import map_parser_to_rules


class ProcessColumnRequest(BaseModel):
    execution_id: Optional[str]
    auth_config: Optional[AuthConfig]
    table_metadata: TableMetadata
    column_config: ColumnConfig


def process_row(row: Mapping[Any, Any]) -> None:
    pass


def process_column(body: ProcessColumnRequest) -> DQMResponse:
    """
    Process a given column from the specified table.

    Args:
        * body: ProcessColumnRequest HTTP request body

    Returns:
        * DQMResponse for the run with a 200 status code

    Raises:
        * MalformedConfigError: if the request body was malformed
    """

    (parser, usable_rules) = map_parser_to_rules(body.column_config.parser)

    rules = generate_selected_rules(body.column_config.rules, usable_rules)

    credentials = get_credentials(body.auth_config)

    bq_storage_read_client = get_bq_storage_read_client(credentials)

    column_name = body.column_config.column

    rows_iterator = get_readrows_iterator(bq_storage_read_client,
                                          body.table_metadata,
                                          columns=[column_name])

    row_counter = 0
    parse_failures = 0
    rule_errors = 0
    check_violations = 0

    for row in rows_iterator:
        cell = row[column_name]
        try:
            value = parser(cell)
        except Exception:
            # parsing failed
            # TODO: log it
            parse_failures += 1
        else:
            for rule_checker in rules:
                try:
                    result = rule_checker(value)
                except Exception:
                    # rule check failed
                    # TODO: log it
                    rule_errors += 1
                else:
                    if result is not None:
                        # rule check violated
                        # TODO: log it
                        check_violations += 1
        row_counter += 1

    message = (f'DQM processed {row_counter} rows, with '
               f'{parse_failures} parse failures, '
               f'{rule_errors} rule errors, '
               f'{check_violations} rule check violations.')

    return DQMResponse(message=message, code=200)
