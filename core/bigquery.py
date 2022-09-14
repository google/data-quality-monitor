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

from enum import Enum
from typing import Iterable, Mapping, Union, cast

from google.auth import default
from google.auth.impersonated_credentials import \
    Credentials as ImpersonatedCredentials
from google.cloud.bigquery import Client as BigQueryLegacyClient
from google.cloud.bigquery_storage import BigQueryReadClient, ReadSession
from google.oauth2.credentials import Credentials as OAuthCredentials

SCOPES = ('https://www.googleapis.com/auth/bigquery',
          'https://www.googleapis.com/auth/cloud-platform')

Credentials = Union[OAuthCredentials, ImpersonatedCredentials]


class DataFormat(Enum):
    """
    Data format for BigQuery Storage API input or output data.

    Note: Reproduced from bigquery_storage_v1/types/stream.py
    """
    DATA_FORMAT_UNSPECIFIED = 0
    AVRO = 1
    ARROW = 2


def build_table_path(project_id: str, dataset_id: str, table_name: str) -> str:
    """
    Builds a fully qualified BigQuery table path from its parts.

    Args:
        * project_id: GCP Project ID
        * dataset_id: Dataset name
        * table_name: Table name

    Returns:
        * Formatted table path
    """
    return f"projects/{project_id}/datasets/{dataset_id}/tables/{table_name}"


def get_default_credentials() -> OAuthCredentials:
    """
    Get the application default credentials for BigQuery scopes, as per the \
    [docs](https://cloud.google.com/docs/authentication/production#automatically).

    Returns:
        * OAuth2 Credentials
    """
    credentials, _ = default(scopes=SCOPES)
    return credentials


def get_service_account_credentials(
    source_credentials: OAuthCredentials,
    service_account_email: str,
) -> ImpersonatedCredentials:
    """
    Get impersonated credentials for a service account, for BigQuery scopes \
    using valid source credentials, as per the \
    [docs](https://cloud.google.com/iam/docs/impersonating-service-accounts).

    Args:
        * source_credentials: Credentials for User having \
            "Service Account Token Creator" permission
        * service_account_email: Email address of service account

    Returns:
        * Impersonated Credentials
    """
    return ImpersonatedCredentials(source_credentials=source_credentials,
                                   target_principal=service_account_email,
                                   target_scopes=SCOPES)


def get_bq_legacy_client(project_id: str,
                         credentials: Credentials) -> BigQueryLegacyClient:
    """
    Get an authenticated BigQuery API client (legacy), as per the \
    [docs](https://googleapis.dev/python/bigquery/latest/index.html).

    Args:
        * project_id: GCP Project ID
        * credentials: Credentials for User having \
            "BigQuery Data Viewer" permission

    Returns:
        * BigQuery API client
    """
    return BigQueryLegacyClient(project=project_id, credentials=credentials)


def get_bq_storage_read_client(credentials: Credentials) -> BigQueryReadClient:
    """
    Get an authenticated BigQuery Storage API client, as per the \
    [docs](https://cloud.google.com/python/docs/reference/bigquerystorage/latest).

    Args:
        * credentials: Credentials for User having \
            "BigQuery Data Viewer" & "BigQuery Read Session User" permissions

    Returns:
        * BigQuery Storage API client
    """
    return BigQueryReadClient(credentials=credentials)


def get_readrows_iterator(
        bq_storage_read_client: BigQueryReadClient,
        project_id: str,
        dataset_id: str,
        table_name: str,
        columns: Union[Iterable[str], None] = None,
        data_format: DataFormat = DataFormat.AVRO) -> Iterable[Mapping]:
    """
    Get an Iterator of Row Mappings with the requested columns of the table,\
    using an authenticated BigQuery Storage API client.

    Note: Max read stream count is 1, as DQM parallelizes at the column level.

    Args:
        * bq_storage_read_client: BigQuery Storage API client
        * project_id: GCP Project ID
        * dataset_id: Dataset name
        * table_name: Table name
        * columns: List of columns to select
        * data_format: Format to fetch data in, one of:
            * DataFormat.AVRO
            * DataFormat.ARROW

    Defaults:
        * columns: None, i.e. select all columns
        * data_format: AVRO, since it auto-parses to Dict

    Returns:
        * Iterator of Row Mappings
    """
    table_path = build_table_path(project_id, dataset_id, table_name)

    requested_session = ReadSession(table=table_path,
                                    data_format=data_format.value,
                                    read_options={"selected_fields": columns})

    session = bq_storage_read_client.create_read_session(
        parent=f"projects/{project_id}",
        read_session=requested_session,
        max_stream_count=1,
    )

    # Use 0th stream because because max_stream_count=1
    stream_name = session.streams[0].name

    reader = bq_storage_read_client.read_rows(stream_name)
    rows = reader.rows(session)

    # Docstring return type is Iterable[Mapping]
    # cast for mypy to prevent [no-any-return] error
    return cast(Iterable[Mapping], rows)
