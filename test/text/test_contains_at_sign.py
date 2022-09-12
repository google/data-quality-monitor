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

import unittest

from rules.text import contains_at_sign


class ContainsAtSign(unittest.TestCase):

    def setUp(self) -> None:
        self.rule_checker = contains_at_sign()
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_string_with_character(self):
        self.assertIsNotNone(self.rule_checker("@"))
        self.assertIsNotNone(self.rule_checker("john@doe.nl"))
        self.assertIsNotNone(self.rule_checker("john@@"))

    def test_string_without_character(self):
        self.assertIsNone(self.rule_checker("johndoe.com"))
        self.assertIsNone(self.rule_checker(""))
