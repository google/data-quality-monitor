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

from typing import Any, Callable, Dict, TypeVar, Union

# Stand-in for "Type"
T = TypeVar('T')

TypeParser = Callable[[Any], T]
"""
Type Parsers

The parser must be named "parse_type" where "type" is a valid defined type. It
will be passed the value as Any and should return a valid Type value. If
there is a parsing issue, it should return the error as a String.

Example -
    def parse_type(value: Any) -> Type:
        '''
        Attempts to parse a Type from Any value.

        Args:
            * value: of Any type

        Returns:
            * Type value: if possible

        Raises:
            * ValueError: if parsing fails
        '''
        try:
            # attempt parsing
            return typed_value
        except:
            raise ValueError('Failed to parse a value.')
"""

ParsersMap = Dict[str, TypeParser]

RuleOutput = Union[None, str]
RuleChecker = Callable[[T], RuleOutput]
"""
Rule Checkers

The rule should be named & defined to check values such that a return value of
None is ignored, but returning a String is logged as a failure. It will be
passed the value parsed as a Type.

We wrap the actual checking function, so that configured parameters can be
evaluated to generate a "finalized" function with better runtime performance.

Example -
    def is_foobar(arg_one: type_one,
                  arg_def: type_def = default_value,
                  ...) -> RuleChecker[Type]:
        '''
        Checks if the value IS a foobar - given arg_one, arg_def, etc.

        Args:
            * arg_one: argument

        Default:
            * arg_def: default value

        Returns:
            * None: if value is foobar
            * Error message: otherwise
        '''
        def _checker(value: Type) -> RuleOutput:
            if meets_conditions(value, arg_one, ...):
                return 'Value is not foobar.'
            else:
                return None

        return _checker
"""

RuleWrapper = Callable[..., RuleChecker[T]]
RulesMap = Dict[str, RuleWrapper[T]]
