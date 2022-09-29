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
from typing import Optional

from pydantic import BaseModel

from core import __version__
from core.auth import AuthConfig, get_credentials
from core.bigquery import (TableMetadata, get_bq_storage_read_client,
                           get_readrows_iterator)
from core.config import ColumnConfig, generate_selected_rules
from core.helpers import get_function_name
from core.http import DQMResponse
from core.logging import BigQueryLogger, Logger, PrintLogger
from rules import map_parser_to_rules


class ProcessColumnRequest(BaseModel):
    execution_id: str = 'development'
    auth_config: Optional[AuthConfig]
    source_table: TableMetadata
    log_table: Optional[TableMetadata]
    column_config: ColumnConfig


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
    version_id = __version__
    now_utc = datetime.utcnow()

    credentials = get_credentials(body.auth_config)

    logger: Logger
    if not body.log_table:
        logger = PrintLogger()
    else:
        logger = BigQueryLogger(body.log_table, body.auth_config)

    logger.set_base_log(version_id, body.execution_id, body.source_table,
                        now_utc)

    bq_storage_read_client = get_bq_storage_read_client(credentials)

    (parser, usable_rules) = map_parser_to_rules(body.column_config.parser)

    rules = generate_selected_rules(body.column_config.rules, usable_rules)

    column_name = body.column_config.column

    rows_iterator = get_readrows_iterator(bq_storage_read_client,
                                          body.source_table,
                                          columns=[column_name])

    row_counter = 0
    parse_failures = 0
    rule_errors = 0
    check_violations = 0

    for row in rows_iterator:
        cell = row[column_name]
        try:
            value = parser(cell)
        except Exception as e:
            # parsing failed
            logger.parser(column_name, get_function_name(parser), str(e))
            parse_failures += 1
        else:
            for rule in rules:
                try:
                    result = rule(value)
                except Exception as e:
                    # rule check failed
                    logger.rule(
                        column_name,
                        get_function_name(rule),
                        str(e),
                        # TODO: Get actual params
                        rule.__defaults__)  # type: ignore
                    rule_errors += 1
                else:
                    if result is not None:
                        # rule check violated
                        logger.rule(
                            column_name,
                            get_function_name(rule),
                            result,
                            # TODO: Get actual params
                            rule.__defaults__)  # type: ignore
                        check_violations += 1

        row_counter += 1
        logger.flush()

    logger.flush(force=True)

    message = (f'DQM processed {row_counter} rows, with '
               f'{parse_failures} parse failures, '
               f'{rule_errors} rule errors, '
               f'{check_violations} rule check violations.')

    return DQMResponse(message=message, code=200)
