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

from rules import map_parser_to_rules
from rules import NumericRules
from rules import TextRules


class MapParserToRulesTest(unittest.TestCase):

    def test_invalid_parser_name(self):
        with self.assertRaises(ValueError):
            map_parser_to_rules("invalid_parser")

    def test_parse_str(self):
        parser, rules = map_parser_to_rules("parse_str")

        self.assertIn('parse_str', parser.__qualname__)
        self.assertEqual(TextRules, rules)

    def test_parse_int(self):
        parser, rules = map_parser_to_rules("parse_int")

        self.assertIn('parse_int', parser.__qualname__)
        self.assertEqual(NumericRules, rules)

    def test_parse_float(self):
        parser, rules = map_parser_to_rules("parse_float")

        self.assertIn('parse_float', parser.__qualname__)
        self.assertEqual(NumericRules, rules)
