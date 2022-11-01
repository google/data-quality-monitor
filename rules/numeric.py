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
from typing import Any, Union

from .common import RuleChecker, RuleOutput, RulesMap

# Define numeric value as either int or float
Numeric = Union[int, float]

# BigQuery Floating point literals
# https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#floating_point_literals
NotANumber = 'NaN'
Infinity = 'inf'
PositiveInfinity = '+inf'
NegativeInfinity = '-inf'


def parse_int(value: Any) -> Numeric:
    """
    Attempts to parse a valid integer value from Any value.

    Returns:
        * int value: if valid

    Raises:
        * ValueError: if parsing failed
    """

    return int(value)


def parse_float(value: Any) -> Numeric:
    """
    Attempts to parse a valid floating point value from Any value.

    Returns:
        * float value: if valid

    Raises:
        * ValueError: if parsing failed
    """

    return float(value)


def is_within_strict_int_range(lower_bound: int,
                               upper_bound: int) -> RuleChecker[Numeric]:
    """
    Checks if the provided numeric value IS strictly bounded by integers
    i.e. (lower_bound, upper_bound), with both bounds exclusive.

    Returns:
        * None: if lower_bound < value < upper_bound
        * Error message, otherwise
    """

    def _checker(value: Numeric) -> RuleOutput:
        if lower_bound < value < upper_bound:
            return None
        else:
            return 'Value is not within the strict range.'

    return _checker


def is_not_negative() -> RuleChecker[Numeric]:
    """
    Checks if the provided numeric value IS NOT negative
    i.e NOT positive (+) or zero (0).

    Returns:
        * None: if value >= 0
        * Error message, otherwise
    """

    def _checker(value: Numeric) -> RuleOutput:
        if value >= 0:
            return None
        else:
            return 'Value is a negative number.'

    return _checker


IEEE_TOLERANCE = 1e-8


def is_not_approx_zero(
        tolerance: float = IEEE_TOLERANCE) -> RuleChecker[Numeric]:
    """
    Checks if the provided numeric value IS NOT within a
    tolerance of zero (0) i.e [0 - tolerance, 0 + tolerance].

    Defaults:
        * tolerance: 1e-8 (8 decimal digits), as per
            [PEP485](https://peps.python.org/pep-0485/#absolute-tolerance-default).

    Returns:
        * None: if abs(value) > abs(tolerance)
        * Error message, otherwise
    """
    absolute_tolerance = abs(tolerance)

    def _checker(value: Numeric) -> RuleOutput:
        if not math.isclose(
                value,
                0,
                rel_tol=0,
                # Use abs_tol for comparisons to zero
                abs_tol=absolute_tolerance,
        ):
            return None
        else:
            return 'Value is approximately zero.'

    return _checker
