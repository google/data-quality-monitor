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

import re
from typing import Any

from .common import RuleChecker, RuleOutput


def parse_str(value: Any) -> str:
    """
    Convert the provided value into a string value.

    Returns:
        * string value
    """

    return str(value)


def is_email() -> RuleChecker[str]:
    """
    Checks if the string is possibly an email address.
    """
    # regex to detect if string is an email address
    regex = r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'
    pattern = re.compile(regex)

    def _checker(string: str) -> RuleOutput:
        if (pattern.search(string)):
            return 'String contains a possible email address.'
        else:
            return None

    return _checker


def contains_at_sign() -> RuleChecker[str]:
    """
    Checks if the string contains "@", e.g. for quickly detecting
    email addresses.
    """

    def _checker(string: str) -> RuleOutput:

        if '@' in string:
            return 'String contains the @ character.'
        else:
            return None

    return _checker


def search_regex(regex: str) -> RuleChecker[str]:
    """
    Checks if the string contains some part of a given regular
    expression, i.e string contains the word "Approved".
    """
    pattern = re.compile(regex)

    def _checker(string: str) -> RuleOutput:
        #
        if (pattern.search(string)):
            return 'String contains a match for the given pattern.'
        else:
            return None

    return _checker


def fully_matches_regex(regex: str) -> RuleChecker[str]:
    """
    Checks if the string fully matches a given regular expression,
    i.e. string fully matches "gmail.com$".
    """
    pattern = re.compile(regex)

    def _checker(string: str) -> RuleOutput:
        if (pattern.fullmatch(string)):
            return 'String is a full match for the given pattern.'
        else:
            return None

    return _checker


def is_phone_number() -> RuleChecker[str]:
    """
    Checks if the string is possibly a phone number.
    """
    pattern = re.compile(r'[\-\(\)\.\+\ ]')

    def _checker(string: str) -> RuleOutput:
        string = pattern.sub('', string)
        try:
            int_number = int(string)
            if 9 < len(string) < 14 and int_number > 999999:
                return 'String contains a possible phone number.'
            else:
                return None
        except ValueError:
            return None

    return _checker
