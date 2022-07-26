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

from rules.numeric import IEEE_TOLERANCE, is_not_approx_zero


class IsNotApproxZeroTest(unittest.TestCase):

    def setUp(self) -> None:
        # Use default ieee tolerance
        self.rule_checker = is_not_approx_zero()
        return super().setUp()

    def test_returns_callable(self):
        self.assertTrue(callable(self.rule_checker))

    def test_integer_zero(self):
        # 0 is zero
        self.assertIn('is approximately zero', self.rule_checker(0))

    def test_float_zero(self):
        # 0.0 is zero
        self.assertIn('is approximately zero', self.rule_checker(0.0))

    def test_positive_small_float(self):
        # +0.00002 is not zero
        self.assertIsNone(self.rule_checker(0.00002))

    def test_positive_large_float(self):
        # +12434347.678 is not zero
        self.assertIsNone(self.rule_checker(12434347.678))

    def test_negative_small_float(self):
        # -0.001 is not zero
        self.assertIsNone(self.rule_checker(-0.001))

    def test_negative_large_float(self):
        # -10000676.001 is not zero
        self.assertIsNone(self.rule_checker(-10000676.001))


class IsNotApproxZeroDefaultToleranceThresholdsTest(unittest.TestCase):

    def setUp(self) -> None:
        # Use default ieee tolerance
        self.tolerance = IEEE_TOLERANCE
        self.rule_checker = is_not_approx_zero()
        return super().setUp()

    def test_near_positive_tolerance(self):
        # Near but below positive tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(+self.tolerance * 0.99))

    def test_near_negative_tolerance(self):
        # Near but below negative tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(-self.tolerance * 0.99))

    def test_full_positive_tolerance(self):
        # Full positive tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(+self.tolerance))

    def test_full_negative_tolerance(self):
        # Full negative tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(-self.tolerance))

    def test_beyond_positive_tolerance(self):
        # Beyond positive tolerance is not zero
        self.assertIsNone(self.rule_checker(+self.tolerance * 1.001))

    def test_beyond_negative_tolerance(self):
        # Beyond negative tolerance is not zero
        self.assertIsNone(self.rule_checker(-self.tolerance * 1.001))


class IsNotApproxZeroCustomToleranceThresholdsTest(unittest.TestCase):

    def setUp(self) -> None:
        # Use custom tolerance of 0.001
        self.tolerance = 0.001
        self.rule_checker = is_not_approx_zero(self.tolerance)

    def test_near_positive_tolerance(self):
        # Near but below positive tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(+self.tolerance * 0.99))

    def test_near_negative_tolerance(self):
        # Near but below negative tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(-self.tolerance * 0.99))

    def test_full_positive_tolerance(self):
        # Full positive tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(+self.tolerance))

    def test_full_negative_tolerance(self):
        # Full negative tolerance is zero
        self.assertIn('is approximately zero',
                      self.rule_checker(-self.tolerance))

    def test_beyond_positive_tolerance(self):
        # Beyond positive tolerance is not zero
        self.assertIsNone(self.rule_checker(+self.tolerance * 1.001))

    def test_beyond_negative_tolerance(self):
        # Beyond negative tolerance is not zero
        self.assertIsNone(self.rule_checker(-self.tolerance * 1.001))
