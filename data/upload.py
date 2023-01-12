"""
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
"""

from csv import DictReader
from enum import Enum
import os
from typing import List, Optional

from core.auth import AuthConfig
from core.auth import get_credentials
from core.bigquery import build_table_metadata
from core.bigquery import create_table
from core.bigquery import get_bq_legacy_client
from core.bigquery import get_table
from core.bigquery import upload_rows
from core.helpers import Buffer

from .configs import CONFIGS
from .helpers import Config
from .helpers import generate_bigquery_schema
from .helpers import get_csv_row_count
from .helpers import Row


class Action(Enum):
    APPEND = 'APPEND'
    REPLACE = 'REPLACE'


def upload_file(filename: str,
                config: Config,
                full_table_id: str,
                action: Action = Action.APPEND,
                service_account_email: Optional[str] = None) -> None:
    """
    Upload a data file conforming to the given config to BigQuery.

    Args:
        * filename: Local path to csv file to be uploaded
        * config: Config key from configs.CONFIGS dictionary
        * full_table_id: BigQuery table id
        * action: APPEND to table or REPLACE table
        * service_account_email: Email address of service account
    """
    if service_account_email:
        auth_config = AuthConfig(service_account_email=service_account_email)
    else:
        auth_config = None

    table_metadata = build_table_metadata(full_table_id)

    credentials = get_credentials(auth_config)
    bq_legacy_client = get_bq_legacy_client(table_metadata.project_id,
                                            credentials)

    table_exists = get_table(bq_legacy_client, table_metadata) is not None

    if table_exists and action == Action.REPLACE:
        bq_legacy_client.delete_table(table_metadata.full_table_id)
        table_exists = False

    if not table_exists:
        schema = generate_bigquery_schema(config)
        create_table(bq_legacy_client, table_metadata, schema)

    row_count = get_csv_row_count(filename)
    columns = [column.bq_name for column in config]

    with open(filename, 'r') as f:
        csv = DictReader(f, fieldnames=columns)

        buffer_: List[Row] = []
        buffer_size = row_count // 100
        buffer = Buffer[Row](
            buffer_, buffer_size,
            lambda rows: upload_rows(bq_legacy_client, table_metadata, rows))

        for row in csv:
            buffer.push(row)

        buffer.flush(force=True)


if __name__ == "__main__":
    upload_file(filename=os.getenv('INFILE', ''),
                config=CONFIGS[os.getenv('CONFIG', '')],
                full_table_id=os.getenv('TABLE', ''),
                action=Action(os.getenv('ACTION', '').upper() or 'APPEND'),
                service_account_email=os.getenv('SAEMAIL'))
