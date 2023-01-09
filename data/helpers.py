from dataclasses import dataclass
import re
from typing import Any, Callable, Dict, List

from faker import Faker

BQ_REGEX = re.compile(r'[^a-zA-Z0-9]')


def build_valid_bq_name(name: str) -> str:
    """
    Build a valid BigQuery name.

    Args:
        * name: original name

    Returns:
        * transformed valid name
    """
    return BQ_REGEX.sub('_', name).lower()


def words_string(fake: Faker, n: int) -> str:
    """
    Provide Faker words as a joined string.

    Args:
        * fake: Faker instance
        * n: number of words

    Returns:
        * string of n words joined by spaces
    """
    return ' '.join(fake.words(n))


@dataclass
class Column:
    """
    Representation of a column of CSV or BigQuery data

    Args:
        * name: original name
        * bqtype: BigQuery data type
            (https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types)
        * value: Function uses a Faker to generate a new value

    Attributes:
        * bqname: transformed name valid on BQ
    """
    name: str
    bq_type: str
    value: Callable[[Faker], Any]

    bq_name: str = ''

    def __post_init__(self) -> None:
        self.bq_name = build_valid_bq_name(self.name)


Row = Dict[str, Any]
Config = List[Column]
