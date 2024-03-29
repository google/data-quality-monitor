"""
Copyright 2023 Google LLC

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
from typing import Any, Dict, List

from typing_extensions import NotRequired
from typing_extensions import TypedDict

from rules.common import RuleChecker
from rules.common import RulesMap


class RuleConfig(TypedDict):
    rule: str
    args: NotRequired[Dict[str, Any]]


class ColumnConfig(TypedDict):
    column: str
    parser: str
    rules: List[RuleConfig]


def generate_selected_rules(rule_configs: List[RuleConfig],
                            rules: RulesMap) -> List[RuleChecker]:
    """
    Generates rule checkers from the provided rule configs and
    mappable rules.

    Args:
        * rule_configs: List of RuleConfigs, with potential args
        * rules: Typed RulesMap

    Returns:
        * List of RuleCheckers with args applied

    Raises:
        * ValueError: if non-existent rule name provided
    """
    selected_rules: List[RuleChecker] = []

    for rule_config in rule_configs:
        rule_name = rule_config['rule']
        if rule_name not in rules:
            raise ValueError('Invalid rule specified.')
        else:
            args = rule_config.get('args', {})
            rule = rules[rule_name](**args)
            rule.__name__ = rule_name
            rule.__kwdefaults__ = args
            selected_rules.append(rule)

    if len(selected_rules) == 0:
        raise ValueError('No rules specified.')

    return selected_rules
