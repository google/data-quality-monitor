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
from typing import Any, Callable, Generic, List, NoReturn, TypeVar, Union


def get_function_name(function: Any) -> str:
    """
    Get the original name of a function, removing module paths.

    Args:
        * function: function instance

    Returns:
        * Actual name of function

    """
    return str(function.__qualname__.split('.')[0])


T = TypeVar('T')
FlushFunction = Callable[[List[T]], Any]


class Buffer(Generic[T]):
    """
    Representation of a Buffer (FIFO queue) with the ability to
    consume the current queue into a flush function when max_size is reached.

    It can queue any list of items, e.g. logs, rows, and API calls.

    Args:
        * initlist: Initial list of items
        * max_size: Maximum queue size
        * flusher: Function to be called with list of items
    """

    queue: List[T]
    max_size: int
    flusher: Union[FlushFunction, NoReturn]

    def __init__(self, initlist: List[T], max_size: int,
                 flusher: FlushFunction) -> None:
        self.queue = initlist
        self.max_size = max_size
        self.flusher = flusher

    def flush(self, force: bool = False) -> bool | Any:
        """
        Empty and consume queue items, if force or max_size reached

        Args:
            * force: If True, force queue to flush

        Returns:
            * True, if flushed with no errors
            * False, if not flushed
            * Error value from consumer, if flushed with errors
        """
        if force or len(self.queue) > self.max_size:
            result = self.flusher(self.queue)
            self.queue.clear()
            return result or True
        else:
            return False

    def push(self, item: T) -> bool | Any:
        """
        Add item to queue and attempt a flush.

        Args:
            * item: Item to add to queue

        Returns:
            * True, if flushed with no errors
            * False, if not flushed
            * Error value from consumer, if flushed with errors
        """
        self.queue.append(item)
        return self.flush()
