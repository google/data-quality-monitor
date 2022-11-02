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

from typing import List, Union

from google.auth import default
from google.auth.impersonated_credentials import \
    Credentials as ImpersonatedCredentials
from google.oauth2.credentials import Credentials as OAuthCredentials
from typing_extensions import NotRequired, TypedDict

Credentials = Union[OAuthCredentials, ImpersonatedCredentials]

GCP_SCOPES = ['https://www.googleapis.com/auth/cloud-platform']


class AuthConfig(TypedDict):
    service_account_email: NotRequired[str]
    scopes: NotRequired[List[str]]


def get_default_credentials(scopes: List[str] = []) -> OAuthCredentials:
    """
    Get the application default credentials for BigQuery scopes, as per the
    [docs](https://cloud.google.com/docs/authentication/production#automatically).

    Args:
        * scopes (optional): List containing valid OAuth 2.0
            [scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

    Note: The auth/cloud-platform scope is always used.

    Returns:
        * OAuth2 Credentials
    """
    credentials, _ = default(scopes=GCP_SCOPES + scopes)
    return credentials


def get_service_account_credentials(
        source_credentials: OAuthCredentials,
        service_account_email: str,
        scopes: List[str] = []) -> ImpersonatedCredentials:
    """
    Get impersonated credentials for a service account, for BigQuery scopes
    using valid source credentials, as per the
    [docs](https://cloud.google.com/iam/docs/impersonating-service-accounts).

    Args:
        * source_credentials: Credentials for User having
            "Service Account Token Creator" permission
        * service_account_email: Email address of service account
        * scopes (optional): List containing valid OAuth 2.0
            [scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

    Returns:
        * Impersonated Credentials
    """
    return ImpersonatedCredentials(source_credentials=source_credentials,
                                   target_principal=service_account_email,
                                   target_scopes=GCP_SCOPES + scopes)


def get_credentials(auth_config: AuthConfig | None) -> Credentials:
    """
    Get default credentials, or impersonated credentials if a service account
    is provided, with the given scopes.

    Args: AuthConfig, with:
        * service_account_email (optional): Email address of service account
        * scopes (optional): List containing valid OAuth 2.0
            [scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

    Returns:
        * Default or Impersonated Credentials
    """
    service_account_email = None
    scopes = []
    if auth_config:
        service_account_email = auth_config.get('service_account_email', '')
        scopes = auth_config.get('scopes', [])

    default_credentials = get_default_credentials(scopes)

    credentials: Credentials
    if service_account_email:
        credentials = get_service_account_credentials(default_credentials,
                                                      service_account_email,
                                                      scopes)
    else:
        credentials = default_credentials

    return credentials
