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

from typing import cast
import unittest

from rules.numeric import is_not_negative

# BigQuery & Python max integer values are equivalent -
# https://docs.python.org/3/library/sys.html#sys.maxsize
# https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#integer_type
MAX_INT = 2**64 - 1


class IntIsNotNegativeTest(unittest.TestCase):

    def setUp(self):
        self.rule_checker = is_not_negative()
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_zero_is_not_negative(self):
        # 0 >= 0
        self.assertIsNone(self.rule_checker(0))

    def test_positive_is_not_negative(self):
        # +3 >= 0
        self.assertIsNone(self.rule_checker(3))

    def test_negative_is_negative(self):
        # -4 < 0
        self.assertIn('is a negative', cast(str, self.rule_checker(-4)))

    def test_bigquery_max_positive_int(self):
        # +max_int is positive
        self.assertIsNone(self.rule_checker(+MAX_INT))

    def test_bigquery_max_negative_int(self):
        # -max_int is negative
        self.assertIn('is a negative', cast(str, self.rule_checker(-MAX_INT)))


class FloatIsNotNegativeTest(unittest.TestCase):

    def setUp(self):
        self.rule_checker = is_not_negative()
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_zero_is_not_negative(self):
        # 0 >= 0
        self.assertIsNone(self.rule_checker(0.0))

    def test_positive_is_not_negative(self):
        # +3 >= 0
        self.assertIsNone(self.rule_checker(3.0))

    def test_negative_is_negative(self):
        # -4 < 0
        self.assertIn('is a negative', cast(str, self.rule_checker(-4.0)))
