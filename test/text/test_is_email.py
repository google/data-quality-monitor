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

import unittest

from rules.text import is_email


class IsEmailTest(unittest.TestCase):

    def setUp(self) -> None:
        self.rule_checker = is_email()
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_valid_emails(self):
        # standard email addresses
        self.assertIsNone(self.rule_checker("john@doe.com"))
        self.assertIsNone(self.rule_checker("john@doe.nl"))
        self.assertIsNone(self.rule_checker("john@doe.co.uk"))

        # dot seperated email name
        self.assertIsNone(self.rule_checker("john.doe@doe.com"))

        # email with number
        self.assertIsNone(self.rule_checker("john.doe3@doe.com"))

        # email with capitals
        self.assertIsNone(self.rule_checker("john.DOE3@doe.cOm"))

        # leading space
        self.assertIsNone(self.rule_checker(" john@doe.com"))

        # trailing space
        self.assertIsNone(self.rule_checker("john@doe.com "))

        # email in random string
        self.assertIsNone(
            self.rule_checker("asdfasdfsdf john@doe.comdsfkjaslkje8kd"))

    def test_invalid_characters(self):
        # quotes
        self.assertIsNotNone(self.rule_checker("john\"@doe.com"))
        self.assertIsNotNone(self.rule_checker("john'@doe.com"))
        self.assertIsNotNone(self.rule_checker("john@doe\".com"))
        self.assertIsNotNone(self.rule_checker("john@do'e.com"))

        # asterisk
        self.assertIsNotNone(self.rule_checker("john**@doe.com"))
        self.assertIsNotNone(self.rule_checker("john@do*e.com"))

        # backslash
        # self.assertIsNotNone(self.rule_checker("jo\hn@doe.com"))
        self.assertIsNotNone(self.rule_checker(r"john@do\e.com"))

    def test_invalid_email_structure(self):
        # missing address sign
        self.assertIsNotNone(self.rule_checker("john.com"))

        # double at sign
        self.assertIsNotNone(self.rule_checker("john@@com"))

        # wrongly placed at sign
        self.assertIsNotNone(self.rule_checker("johndoe.co@m"))

        # leading at sign
        self.assertIsNotNone(self.rule_checker("@john.com"))

        # trailing at sign
        self.assertIsNotNone(self.rule_checker("john.com@"))

        # missing dot
        self.assertIsNotNone(self.rule_checker("john@doecom"))

        # double dot in domain
        self.assertIsNotNone(self.rule_checker("john@doe..com"))

    def test_invalid_input(self):
        # number string
        self.assertIsNotNone(self.rule_checker('252342'))

        # character string
        self.assertIsNotNone(self.rule_checker('*#^$*(@($&'))
