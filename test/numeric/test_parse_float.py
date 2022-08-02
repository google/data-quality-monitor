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

import math
import unittest
from typing import cast

from rules.numeric import (Infinity, NegativeInfinity, NotANumber,
                           PositiveInfinity, parse_float)


class ParseFloatTest(unittest.TestCase):

    def setUp(self):
        self.value_parser = parse_float()
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.value_parser))

    def test_zero_value(self):
        # 0 is a float
        self.assertEqual(self.value_parser("0.0"), 0.0)

    def test_positive_value(self):
        # +101.23 is a float
        self.assertEqual(self.value_parser("+101.23"), +101.23)

    def test_negative_value(self):
        # -101.56 is a float
        self.assertEqual(self.value_parser("-101.56"), -101.56)

    def test_leading_zeros_positive_value(self):
        # +000101.24 is a float
        self.assertEqual(self.value_parser("+000101.24"), +101.24)

    def test_leading_zeros_negative_value(self):
        # -000101.45 is a float
        self.assertEqual(self.value_parser("-000101.45"), -101.45)

    def test_integer_value(self):
        # 1 is an int, equivalent to 1.0 as a float
        self.assertEqual(self.value_parser("1"), 1.0)

    def test_infinity_value(self):
        # Inf is a float
        self.assertEqual(self.value_parser(Infinity), math.inf)

    def test_positive_infinity_value(self):
        # +Inf is a float
        self.assertEqual(self.value_parser(PositiveInfinity), +math.inf)

    def test_negative_infinity_value(self):
        # -Inf is a float
        self.assertEqual(self.value_parser(NegativeInfinity), -math.inf)

    def test_not_a_number_value(self):
        # NaN is a float
        self.assertTrue(math.isnan(cast(float, self.value_parser(NotANumber))))

    def test_string(self):
        # abc is not a number
        self.assertIn('not a valid float', cast(str, self.value_parser("abc")))

    def test_alphanumeric_string(self):
        # 9xyz1 is not a number
        self.assertIn('not a valid float', cast(str,
                                                self.value_parser("9xyz1")))

    def test_alphanumeric_string_with_leading_zeros(self):
        # 0xyz123 is not a number
        self.assertIn('not a valid float',
                      cast(str, self.value_parser("00xyz123")))
