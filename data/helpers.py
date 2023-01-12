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
from dataclasses import dataclass
from typing import Any, Callable, Dict, List

from faker import Faker
from google.cloud.bigquery import SchemaField

from core.bigquery import convert_to_bq_name


def get_csv_row_count(filename: str) -> int:
    """
    Quickly count number of rows in the given csv file.

    Args:
        * filename: Path to CSV file

    Returns:
        * number of rows, minus header
    """
    row_count = 0
    with open(filename, 'r') as f:

        for _ in f:
            row_count += 1

        # account for header in non-empty file
        if row_count != 0:
            row_count -= 1

    return row_count


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
    Representation of a column of Faker data with metadata for CSV
    and BigQuery compatibility.

    Args:
        * name: original name
        * bqtype: BigQuery data type
            (https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types)
        * value: Function uses a Faker to generate a new value

    Attributes:
        * bqname: transformed BigQuery-compatible name
    """
    name: str
    bq_type: str
    value: Callable[[Faker], Any]

    bq_name: str = ''

    def __post_init__(self) -> None:
        self.bq_name = convert_to_bq_name(self.name)


Row = Dict[str, Any]
Config = List[Column]


def generate_row(fake: Faker, config: Config) -> Row:
    """
    Generates a Row of Faker data, conforming to the config.

    Args:
        * fake: Faker instance
        * config: List of Columns

    Returns:
        * Row of Faker data
    """
    row: Row = {}
    for column in config:
        row[column.bq_name] = column.value(fake)
    return row


def generate_bigquery_schema(config: Config) -> List[SchemaField]:
    schema: List[SchemaField] = []
    for column in config:
        bq_column = SchemaField(name=column.bq_name,
                                field_type=column.bq_type,
                                mode='NULLABLE')
        schema.append(bq_column)
    return schema
