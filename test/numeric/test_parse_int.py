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
from typing import cast

from rules.numeric import parse_int


class ParseIntTest(unittest.TestCase):

    def setUp(self):
        self.value_parser = parse_int()
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.value_parser))

    def test_zero_value(self):
        # 0 is an int
        self.assertEqual(self.value_parser("0"), 0)

    def test_positive_value(self):
        # +101 is an int
        self.assertEqual(self.value_parser("+101"), +101)

    def test_negative_value(self):
        # -101 is an int
        self.assertEqual(self.value_parser("-101"), -101)

    def test_leading_zeros_positive_value(self):
        # +000101 is an int
        self.assertEqual(self.value_parser("+000101"), +101)

    def test_leading_zeros_negative_value(self):
        # -000101 is an int
        self.assertEqual(self.value_parser("-000101"), -101)

    def test_floating_point_value(self):
        # 1.5 is a float, not int
        self.assertIn('not a valid int', cast(str, self.value_parser("1.5")))

    def test_string(self):
        # abc is not a number
        self.assertIn('not a valid int', cast(str, self.value_parser("abc")))

    def test_alphanumeric_string(self):
        # 9xyz1 is not a number
        self.assertIn('not a valid int', cast(str, self.value_parser("9xyz1")))

    def test_alphanumeric_string_with_leading_zeros(self):
        # 0xyz123 is not a number
        self.assertIn('not a valid int', cast(str,
                                              self.value_parser("00xyz123")))
