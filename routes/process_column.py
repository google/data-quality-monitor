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

from flask.typing import ResponseReturnValue
from pydantic import BaseModel

from core import __version__
from core.auth import AuthConfig
from core.auth import get_credentials
from core.bigquery import get_bq_read_client
from core.bigquery import get_cells_iterator
from core.bigquery import TableMetadata
from core.config import ColumnConfig
from core.config import generate_selected_rules
from core.http import DQMResponse
from core.logging import BigQueryLogger
from core.logging import Logger
from core.logging import PrintLogger
from rules import map_parser_to_rules


class ProcessColumnRequest(BaseModel):
    workflow_execution_id: str = 'development'
    auth_config: Optional[AuthConfig]
    source_table: TableMetadata
    log_table: Optional[TableMetadata]
    column_config: ColumnConfig


def process_column(body: ProcessColumnRequest) -> ResponseReturnValue:
    """
    Process a given column from the specified table.

    Args:
        * body: ProcessColumnRequest HTTP request body

    Returns:
        * DQMResponse for the run with a 200 status code

    Raises:
        * MalformedConfigError: if the request body was malformed
    """
    credentials = get_credentials(body.auth_config)

    logger: Logger
    if not body.log_table:
        logger = PrintLogger()
    else:
        logger = BigQueryLogger(body.log_table, body.auth_config)

    logger.set_base_log(__version__, body.workflow_execution_id,
                        body.source_table, datetime.utcnow())

    bq_read_client = get_bq_read_client(credentials)

    (parser, usable_rules) = map_parser_to_rules(body.column_config['parser'])

    rules = generate_selected_rules(body.column_config['rules'], usable_rules)

    column_name = body.column_config['column']

    cells_iterator = get_cells_iterator(bq_read_client, body.source_table,
                                        column_name)

    row_counter = 0
    parse_failures = 0
    rule_errors = 0
    check_violations = 0

    for cell in cells_iterator:
        try:
            value = parser(cell)
        except Exception as e:
            # parsing failed
            logger.parser(column_name, parser._name, str(e), cell)
            parse_failures += 1
        else:
            for rule in rules:
                try:
                    result = rule(value)
                except Exception as e:
                    # rule check failed
                    logger.rule(column_name, rule._name, str(e), value,
                                rule._args)
                    rule_errors += 1
                else:
                    if result is not None:
                        # rule check violated
                        logger.rule(column_name, rule._name, result, value,
                                    rule._args)
                        check_violations += 1

        row_counter += 1
        logger.flush()

    logger.flush(force=True)

    if row_counter == 0:
        raise RuntimeError('Source table was empty.')

    message = (f'DQM processed {row_counter} rows, with '
               f'{parse_failures} parse failures, '
               f'{rule_errors} rule errors, '
               f'{check_violations} rule check violations.')

    return (DQMResponse(name='', description=message, code=200), 200)
