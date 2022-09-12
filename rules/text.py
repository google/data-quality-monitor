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

from .common import RuleChecker, RuleOutput


def is_email() -> RuleChecker[str]:
    """
    Checks if the provided value is an email address.
    """
    regex = r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'
    pattern = re.compile(regex)

    def _checker(string: str) -> RuleOutput:
        # regex to detect if string is an email address
        if (pattern.search(string)):
            return 'string contains email'
        else:
            return None

    return _checker


def contains_at_sign() -> RuleChecker[str]:
    """
    A light function to check if a string contains "@". e.g. for detecting
    email adresses.
    """

    def _checker(string: str) -> RuleOutput:
        # regex to detect if string is an email address
        if '@' in string:
            return 'string contains @'
        else:
            return None

    return _checker


def search_regex(regex: str) -> RuleChecker[str]:
    """
    Checks if the provided value contains some part of a given regular
    expression. i.e string contains the word "Approved"
    """
    pattern = re.compile(regex)

    def _checker(string: str) -> RuleOutput:
        #
        if (pattern.search(string)):
            return 'regex found in field'
        else:
            return None

    return _checker


def fully_matches_regex(regex: str) -> RuleChecker[str]:
    """
    Checks if the provided value fully matches a given regular expression.
    i.e strings fully matches "gmail.com$"
    """
    pattern = re.compile(regex)

    def _checker(string: str) -> RuleOutput:
        if (pattern.fullmatch(string)):
            return 'regex matches field'
        else:
            return None

    return _checker


def is_phone_number() -> RuleChecker[str]:
    """
    Checks if the provided value is a phone number.
    """
    pattern = re.compile(r'[\-\(\)\.\+\ ]')

    def _checker(string: str) -> RuleOutput:
        string = pattern.sub('', string)
        try:
            int_number = int(string)
            if 9 < len(string) < 14 and int_number > 999999:
                return 'field is a phone number'
            return None
        except ValueError:
            return None

    return _checker
