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

from core.config import RuleConfig, generate_selected_rules
from rules import NumericRules, RulesMap, TextRules


class GenerateSelectedRulesTest(unittest.TestCase):
    """
    NOTE: We use `func.__qualname__`, as when functions are imported,
    they can have fully qualified names instead of just the declared name.
    """

    def test_empty_rule(self):
        rules: RulesMap = NumericRules | TextRules
        with self.assertRaises(ValueError):
            generate_selected_rules([RuleConfig(rule="")], rules)

    def test_invalid_rule(self):
        rules: RulesMap = NumericRules | TextRules
        with self.assertRaises(ValueError):
            generate_selected_rules([RuleConfig(rule="does_not_exist")], rules)

    def test_mismatched_rule(self):
        rules: RulesMap = NumericRules
        with self.assertRaises(ValueError):
            generate_selected_rules([RuleConfig(rule="search_regex")], rules)

    def test_numeric_rule(self):
        rules: RulesMap = NumericRules
        generated = generate_selected_rules(
            [RuleConfig(rule="is_not_negative")], rules)
        generated_rule = generated[0]

        self.assertIn('is_not_negative', generated_rule.__qualname__)

    def test_numeric_rule_with_args(self):
        rules: RulesMap = NumericRules
        generated = generate_selected_rules([
            RuleConfig(rule="is_within_strict_int_range",
                       args={
                           "lower_bound": 100,
                           "upper_bound": 200
                       })
        ], rules)
        generated_rule = generated[0]

        self.assertIn('is_within_strict_int_range', generated_rule.__qualname__)

        self.assertIsNone(generated_rule(150))
        self.assertIn("not within the strict range",
                      cast(str, generated_rule(300)))

    def test_text_rule(self):
        rules: RulesMap = TextRules
        generated = generate_selected_rules([RuleConfig(rule="is_email")],
                                            rules)
        self.assertIn('is_email', generated[0].__qualname__)

    def test_text_rule_with_args(self):
        rules: RulesMap = TextRules
        generated = generate_selected_rules(
            [RuleConfig(rule="search_regex", args={"regex": "testpattern"})],
            rules)
        generated_rule = generated[0]

        self.assertIn('search_regex', generated_rule.__qualname__)

        self.assertIsNone(generated_rule("otherpattern"))
        self.assertIsNotNone(generated_rule("testpattern"))
