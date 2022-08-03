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

from typing import Callable, TypeVar, Union

# Stand-in for "Type"
T = TypeVar('T')

TypeOutput = Union[T, str]
TypeParser = Callable[[str], TypeOutput[T]]
"""
Type Parsers

The parser must be named "parse_type" where "type" is a valid Python type. It
will be passed the value as a String and should return a valid Type value. If
there is a parsing issue, it should return the error as a String.

We wrap the actual parsing function, so that configured parameters can be
evaluated to generate a "finalised" function with better runtime performance.

Example -
def parse_type(arg_one: type_one,
               arg_def: type_def = default_value,
               ...) -> TypeParser[Type]:
    '''
    Parse Type from value - given arg_one, arg_def, etc.

    Arguments:
        * arg_one - argument

    Defaults:
        * arg_def - default value

    Returns:
        * Type value
        * Error message, otherwise
    '''
    def _parser(value: str) -> TypeOutput[Type]:
        try:
            # attempt parsing
            return typed_value
        except:
            return 'Value failed to parse.'

    return _parser
"""

RuleOutput = Union[None, str]
RuleChecker = Callable[[T], RuleOutput]
"""
Rule Checkers

The rule should be named & defined to check values such that a return value of
None is ignored, but returning a String is logged as a failure. It will be
passed the value parsed as a Type.

We wrap the actual checking function, so that configured parameters can be
evaluated to generate a "finalised" function with better runtime performance.

Example -
    def is_foobar(arg_one: type_one,
                  arg_def: type_def = default_value,
                  ...) -> RuleChecker[Type]:
        '''
        Checks if the value IS a foobar - given arg_one, arg_def, etc.

        Arguments:
            * arg_one - argument

        Default:
            * arg_def - default value

        Returns:
            * None - if value is foobar
            * Error message, otherwise
        '''
        def _checker(value: Type) -> RuleOutput:
            if meets_conditions(value, arg_one, ...):
                return 'Value is not foobar.'
            else:
                return None

        return _checker
"""
