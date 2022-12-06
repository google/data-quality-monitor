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

from rules.numeric import is_within_strict_int_range


class IntIsWithinStrictIntRangeTest(unittest.TestCase):

    def setUp(self):
        lower_bound = -10
        upper_bound = +10

        self.rule_checker = is_within_strict_int_range(lower_bound, upper_bound)
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_zero_within_range(self):
        # -10 < 0 < +10
        self.assertIsNone(self.rule_checker(0))

    def test_positive_within_range(self):
        # -10 < 3 < +10
        self.assertIsNone(self.rule_checker(3))

    def test_negative_within_range(self):
        # -10 < -4 < +10
        self.assertIsNone(self.rule_checker(-4))

    def test_negative_near_bounds(self):
        # -9 is near the lower bound
        self.assertIsNone(self.rule_checker(-9))

    def test_negative_at_bounds(self):
        # -10 is the lower bound
        self.assertIn('not within', cast(str, self.rule_checker(-10)))

    def test_negative_past_bounds(self):
        # -11 is past the lower bound
        self.assertIn('not within', cast(str, self.rule_checker(-11)))

    def test_positive_near_bounds(self):
        # +9 is near the upper bound
        self.assertIsNone(self.rule_checker(9))

    def test_positive_at_bounds(self):
        # +10 is the upper bound
        self.assertIn('not within', cast(str, self.rule_checker(10)))

    def test_positive_past_bounds(self):
        # +11 is past the upper bound
        self.assertIn('not within', cast(str, self.rule_checker(11)))


class FloatIsWithinStrictIntRangeTest(unittest.TestCase):

    def setUp(self):
        lower_bound = -10
        upper_bound = +10

        self.rule_checker = is_within_strict_int_range(lower_bound, upper_bound)
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_zero_within_range(self):
        # -10 < 0.0 < +10
        self.assertIsNone(self.rule_checker(0.0))

    def test_positive_within_range(self):
        # -10 < 3.1 < +10
        self.assertIsNone(self.rule_checker(3.1))

    def test_negative_within_range(self):
        # -10 < -4.2 < +10
        self.assertIsNone(self.rule_checker(-4.2))

    def test_negative_near_bounds(self):
        # -9.9 is near the lower bound
        self.assertIsNone(self.rule_checker(-9.9))

    def test_negative_at_bounds(self):
        # -10.0 is the lower bound
        self.assertIn('not within', cast(str, self.rule_checker(-10.0)))

    def test_negative_past_bounds(self):
        # -10.1 is past the lower bound
        self.assertIn('not within', cast(str, self.rule_checker(-10.1)))

    def test_positive_near_bounds(self):
        # +9.9 is near the upper bound
        self.assertIsNone(self.rule_checker(9.9))

    def test_positive_at_bounds(self):
        # +10.0 is the upper bound
        self.assertIn('not within', cast(str, self.rule_checker(10.0)))

    def test_positive_past_bounds(self):
        # +10.1 is past the upper bound
        self.assertIn('not within', cast(str, self.rule_checker(10.1)))
