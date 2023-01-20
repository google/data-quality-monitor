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

from collections.abc import Iterable
import os
import unittest

from google.cloud.bigquery import Client as BigQueryLegacyClient
from google.cloud.bigquery_storage import BigQueryReadClient

from core.auth import get_default_credentials
from core.auth import get_service_account_credentials
from core.auth import ImpersonatedCredentials
from core.auth import OAuthCredentials
from core.bigquery import get_bq_legacy_client
from core.bigquery import get_bq_read_client
from core.bigquery import get_readrows_iterator
from core.bigquery import TableMetadata


class BigQueryClientCredentialsTest(unittest.TestCase):

    def test_get_default_credentials(self):
        credentials = get_default_credentials()
        self.assertIsInstance(credentials, OAuthCredentials)

    def test_get_service_account_credentials(self):
        default_credentials = get_default_credentials()
        sa_credentials = get_service_account_credentials(
            service_account_email=os.environ['SERVICE_ACCOUNT_EMAIL'],
            source_credentials=default_credentials)

        self.assertIsInstance(sa_credentials, ImpersonatedCredentials)
        self.assertEqual(os.environ['SERVICE_ACCOUNT_EMAIL'],
                         sa_credentials.service_account_email)

    def test_get_bq_legacy_client_instance_with_default_account(self):
        default_credentials = get_default_credentials()
        client = get_bq_legacy_client(credentials=default_credentials,
                                      project_id=os.environ['GCP_PROJECT_ID'])
        self.assertIsInstance(client, BigQueryLegacyClient)

    def test_get_bq_legacy_client_instance_with_service_account(self):
        default_credentials = get_default_credentials()
        sa_credentials = get_service_account_credentials(
            service_account_email=os.environ['SERVICE_ACCOUNT_EMAIL'],
            source_credentials=default_credentials)
        client = get_bq_legacy_client(credentials=sa_credentials,
                                      project_id=os.environ['GCP_PROJECT_ID'])
        self.assertIsInstance(client, BigQueryLegacyClient)

    def test_get_bq_storage_client_instance_with_default_account(self):
        default_credentials = get_default_credentials()
        client = get_bq_read_client(credentials=default_credentials)
        self.assertIsInstance(client, BigQueryReadClient)

    def test_get_bq_storage_client_instance_with_service_account(self):
        default_credentials = get_default_credentials()
        sa_credentials = get_service_account_credentials(
            service_account_email=os.environ['SERVICE_ACCOUNT_EMAIL'],
            source_credentials=default_credentials)
        client = get_bq_read_client(credentials=sa_credentials)
        self.assertIsInstance(client, BigQueryReadClient)


class BigQueryReadRowsTest(unittest.TestCase):

    def setUp(self):
        default_credentials = get_default_credentials()
        sa_credentials = get_service_account_credentials(
            service_account_email=os.environ['SERVICE_ACCOUNT_EMAIL'],
            source_credentials=default_credentials)
        self.bqs_client = get_bq_read_client(credentials=sa_credentials)
        return super().setUp()

    def test_get_readrows_iterator(self):
        table_metadata = TableMetadata(project_id=os.environ['GCP_PROJECT_ID'],
                                       dataset_id=os.environ['TEST_DATASET_ID'],
                                       table_name=os.environ['TEST_TABLE_NAME'])
        rows = get_readrows_iterator(self.bqs_client, table_metadata)
        self.assertTrue(isinstance(rows, Iterable))
