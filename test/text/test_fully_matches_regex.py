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
import sys
import unittest

from rules.text import fully_matches_regex


class fullyMatchesRegex(unittest.TestCase):
    def setUp(self) -> None:
        test_regex = r'test'
        self.rule_checker = fully_matches_regex(test_regex)
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_contains_regex(self):
        self.assertIsNotNone(self.rule_checker('test'))

    def test_non_matching_regex(self):
        self.assertIsNone(self.rule_checker('tes'))
        self.assertIsNone(self.rule_checker('tes1t123'))
        self.assertIsNone(self.rule_checker('123'))

    def test_invalid_regex_behaviour(self):
      # pass invalid regex
      test_regex = '['


      # assert that error is raised
      with self.assertRaises(re.error):
        rule_checker = fully_matches_regex(test_regex)
        rule_checker('123')
