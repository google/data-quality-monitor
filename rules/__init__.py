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

from typing import Callable, Dict, List, Tuple

from . import numeric
from . import text
from .common import ParsersMap
from .common import RulesMap
from .common import RuleWrapper
from .common import TypeParser


def func_mapper(funcs: List[Callable]) -> Dict[str, Callable]:
    return dict((func.__name__, func) for func in funcs)


Parsers: ParsersMap = func_mapper(
    [numeric.parse_float, numeric.parse_int, text.parse_str])

NumericRules: RulesMap[numeric.Numeric] = func_mapper([
    numeric.is_not_approx_zero, numeric.is_not_negative,
    numeric.is_within_strict_int_range
])

TextRules: RulesMap[str] = func_mapper([
    text.contains_at_sign, text.fully_matches_regex, text.is_email,
    text.is_phone_number, text.search_regex
])


def map_parser_to_rules(parser_name: str) -> Tuple[TypeParser, RulesMap]:
    """
    Check if the chosen parser exists and return the matching
    parser function and available rule mappings.

    Args:
        * parser: string

    Returns: Tuple, with
        * TypeParser: Func that parses Any to Type
        * RulesMap: Dict of rule name to rule wrapper

    Raises:
        * ValueError: if non-existent parser name provided
    """
    parser: TypeParser
    usable_rules: dict[str, RuleWrapper]

    if parser_name == 'parse_str':
        parser = Parsers['parse_str']
        usable_rules = TextRules
    elif parser_name == 'parse_int':
        parser = Parsers['parse_int']
        usable_rules = NumericRules
    elif parser_name == 'parse_float':
        parser = Parsers['parse_float']
        usable_rules = NumericRules
    else:
        raise ValueError("Invalid parser specified.")

    return parser, usable_rules
