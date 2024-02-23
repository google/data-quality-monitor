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
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
import re
from typing import Any, cast, Dict, Generator, Iterable, List, Mapping

from google.cloud.bigquery import Client as BigQueryLegacyClient
from google.cloud.bigquery import SchemaField
from google.cloud.bigquery import Table
from google.cloud.bigquery_storage import BigQueryReadClient
from google.cloud.bigquery_storage import ReadSession
from google.cloud.exceptions import NotFound

from core.auth import Credentials
from core.helpers import parse_column_path

BQ_SCOPES = ['https://www.googleapis.com/auth/bigquery']


@dataclass
class TableMetadata:
    """
    Contains the necessary metadata to locate a BigQuery table.
    """
    project_id: str
    dataset_id: str
    table_name: str

    # Full BigQuery table ID
    # project_id.dataset_id.table_name
    full_table_id: str = ''

    # Fully qualified BigQuery table path
    # projects/project_id/datasets/dataset_id/tables/table_name
    table_path: str = ''

    def __post_init__(self) -> None:
        if not self.full_table_id:
            self.full_table_id = (f"{self.project_id}"
                                  f".{self.dataset_id}"
                                  f".{self.table_name}")
        if not self.table_path:
            self.table_path = (f"projects/{self.project_id}"
                               f"/datasets/{self.dataset_id}"
                               f"/tables/{self.table_name}")


def build_table_metadata(full_table_id: str) -> TableMetadata:
    """
    Builds a TableMetadata object from a BigQuery full table ID,
    i.e. project_id.dataset_id.table_name.

    Args:
        * full_table_id: BigQuery full table ID

    Returns:
        * TableMetadata object

    """
    parts = full_table_id.split('.')
    return TableMetadata(project_id=parts[0],
                         dataset_id=parts[1],
                         table_name=parts[2])


def get_formatted_timestamp(dt: datetime) -> str:
    """
    Converts a datetime object into the BigQuery timestamp format, as per
    [docs](https://cloud.google.com/bigquery/docs/reference/standard-sql/timestamp_functions#current_timestamp).

    Args:
        * dt: datetime.datetime object

    Returns:
        * BigQuery ISO formatted timestamp
    """
    return dt.isoformat('T')


BQ_REGEX = re.compile(r'[^a-zA-Z0-9]')


def convert_to_bq_name(name: str) -> str:
    """
    Tranform the given string into a valid BigQuery name -
    convert non-alphanumeric characters to an underscore (_)
    and lowercase the result for consistency.

    Args:
        * name: original name

    Returns:
        * Transformed valid name
    """
    return BQ_REGEX.sub('_', name).lower()


def get_bq_legacy_client(project_id: str,
                         credentials: Credentials) -> BigQueryLegacyClient:
    """
    Get an authenticated BigQuery Legacy API client, as per the
    [docs](https://googleapis.dev/python/bigquery/latest/index.html).

    Args:
        * project_id: GCP Project ID
        * credentials: Credentials for User having
            "BigQuery Data Viewer" permission

    Returns:
        * BigQuery API client
    """
    return BigQueryLegacyClient(project=project_id, credentials=credentials)


def get_bq_read_client(credentials: Credentials) -> BigQueryReadClient:
    """
    Get an authenticated BigQuery Storage API Read client, as per the
    [docs](https://cloud.google.com/python/docs/reference/bigquerystorage/latest).

    Args:
        * credentials: Credentials for User having
            "BigQuery Data Viewer" & "BigQuery Read Session User" permissions

    Returns:
        * BigQuery Storage API Read client
    """
    return BigQueryReadClient(credentials=credentials)


class DataFormat(Enum):
    """
    Data format for BigQuery Storage API input or output data.

    Note: Reproduced from bigquery_storage_v1/types/stream.py
    """
    DATA_FORMAT_UNSPECIFIED = 0
    AVRO = 1
    ARROW = 2


def get_readrows_iterator(
        bq_read_client: BigQueryReadClient,
        table_metadata: TableMetadata,
        columns: Iterable[str] | None = None,
        data_format: DataFormat = DataFormat.AVRO) -> Iterable[Mapping]:
    """
    Get an Iterator of row Mappings with the requested columns of the table,
    using an authenticated BigQuery Storage API client.

    Note: Does NOT support nested columns.

    Args:
        * bq_read_client: BigQuery Storage API Read client
        * table_metadata: TableMetadata object
        * columns (optional): List of columns to select
        * data_format: Format to fetch data in, one of:
            * DataFormat.AVRO
            * DataFormat.ARROW

    Defaults:
        * columns: None, i.e. select all columns
        * data_format: AVRO, since it auto-parses to Dict

    Returns:
        * Iterator of row Mappings
    """
    requested_session = ReadSession(table=table_metadata.table_path,
                                    data_format=data_format.value,
                                    read_options={"selected_fields": columns})

    session = bq_read_client.create_read_session(
        parent=f"projects/{table_metadata.project_id}",
        read_session=requested_session,
        max_stream_count=1,
    )
    # Use 0th stream because because max_stream_count=1
    stream_name = session.streams[0].name

    reader = bq_read_client.read_rows(stream_name)
    rows = reader.rows(session)

    # Docstring return type is Iterable[Mapping]
    # cast for mypy to prevent [no-any-return] error
    return cast(Iterable[Mapping], rows)


def get_cells_iterator(
    bq_read_client: BigQueryReadClient,
    table_metadata: TableMetadata,
    column: str,
) -> Generator[Any, None, None]:
    """Retrieves an iterator of cell values for a specified column, optimized
    for both simple and nested column

  access, including handling special value structures with dynamic value types
  for nested columns.

  Args:
      bq_read_client (BigQueryReadClient): The BigQuery Storage API Read client.
      table_metadata (TableMetadata): The table's metadata.
      column (str): The column name, supporting nested fields and array indices
        for complex cases.

  Returns:
      Generator[Any, None, None]: An iterator over cell values.
  """
    # Check if the column path indicates a simple column access
    if "." not in column and "[" not in column:
        # Optimize data retrieval for simple column access
        rows = get_readrows_iterator(bq_read_client,
                                     table_metadata, [column],
                                     data_format=DataFormat.AVRO)
        for row in rows:
            yield row.get(column)
    else:
        # Handle nested and special value structures as before
        nested_columns = parse_column_path(column)
        parent_column = nested_columns[0][0]

        rows = get_readrows_iterator(
            bq_read_client,
            table_metadata,
            [parent_column],
            data_format=DataFormat.AVRO,
        )

        for current_value in rows:
            for column_name, key in nested_columns:
                if isinstance(current_value, dict):
                    current_value = current_value.get(column_name)
                elif isinstance(current_value, list) and key:
                    current_value = next(
                        (item for item in current_value
                         if item.get(column_name) == key),
                        None,
                    )

                if isinstance(current_value, dict) and "value" in current_value:
                    extracted_value = next(
                        (value for key, value in current_value["value"].items()
                         if value is not None),
                        None,
                    )
                    current_value = (extracted_value if extracted_value
                                     is not None else current_value)

                if current_value is None:
                    break
            yield current_value


def get_table(bq_legacy_client: BigQueryLegacyClient,
              table_metadata: TableMetadata) -> Table | None:
    """
    Get a table if it exists in BigQuery given the ID.

    Args:
        * bq_legacy_client: BigQuery Legacy API client
        * table_metadata: TableMetadata object

    Returns:
        * Table object if it exists, else None
    """
    table: Table | None
    try:
        table = bq_legacy_client.get_table(table_metadata.full_table_id)
    except NotFound:
        table = None
    return table


def create_table(bq_legacy_client: BigQueryLegacyClient,
                 table_metadata: TableMetadata,
                 schema: List[SchemaField]) -> Table:
    """
    Create a table in BigQuery given the ID and schema.

    Note: Does NOT support nested columns.

    Args:
        * bq_legacy_client: BigQuery Legacy API client
        * table_metadata: TableMetadata object
        * schema: valid BigQuery table schema

    Returns:
        * Created Table object
    """
    table_def = Table(table_metadata.full_table_id, schema=schema)
    table = bq_legacy_client.create_table(table_def)
    return table


def upload_rows(bq_legacy_client: BigQueryLegacyClient,
                table_metadata: TableMetadata,
                rows: List[Dict[str, Any]]) -> List[str]:
    """
    Upload a List of Dict rows to a BigQuery table, by appending.

    Note: Does NOT support nested columns.

    Args:
        * bq_legacy_client: BigQuery Legacy API client
        * table_metadata: TableMetadata object
        * column: Column name to select

    Returns:
        * List of errors, if any
    """
    if len(rows) > 0:
        result = bq_legacy_client.insert_rows_json(table_metadata.full_table_id,
                                                   rows)
        # result is empty if no errors occurred
        for row in result:
            # Note:
            # Failure here usually indicates a BigQuery log table schema issue
            # We assume all rows will fail with the same error,
            # so we only log one row to prevent polluting cloud logging
            # and immediately return to stop processing data further
            if 'errors' in row and len(row['errors']) > 0:
                return [str(e) for e in row['errors']]
    return []
