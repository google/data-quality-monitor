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
from flask.typing import ResponseReturnValue
from typing_extensions import TypedDict


class DQMResponse(TypedDict):
    """
    DQM Standard HTTP response.

    Args:
        * message: Response message
        * code: HTTP code
    """
    message: str
    code: int


class MalformedConfigError(ValueError):
    """
    Represents an Error due to malformed configuration sent by a client.

    Note: Inherits from ValueError.
    """
    pass


def handle_malformed_config(error: MalformedConfigError) -> ResponseReturnValue:
    """
    DQM Malformed Config Response.

    Args:
        * error: Config error

    Returns:
        * DQMResponse for the error with a 400 status code
    """
    return DQMResponse(message=str(error), code=400)


def handle_server_error(error: Exception) -> ResponseReturnValue:
    """
    DQM Server Error Response.

    Args:
        * error: Server error

    Returns:
        * DQMResponse for the error with a 500 status code
    """
    return DQMResponse(message=str(error), code=500)
