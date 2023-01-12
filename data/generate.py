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

from csv import DictWriter
import os
from typing import List

from faker import Faker

from core.helpers import Buffer

from .configs import CONFIGS
from .helpers import Config
from .helpers import generate_row
from .helpers import Row


def generate_file(filename: str, config: Config, nrows: int) -> None:
    """
    Generate a test data file conforming to the given config.

    Args:
        * filename: Local path to csv file to be generated
        * config: Config key from configs.CONFIGS dictionary
        * nrows: number of rows to generate
    """
    fake = Faker(
        use_weighting=False,  # perf > randomness
    )

    columns = [column.bq_name for column in config]

    with open(filename, 'w+') as f:
        csv = DictWriter(f, fieldnames=columns)
        csv.writeheader()

        buffer_: List[Row] = []
        buffer_size = nrows // 100
        buffer = Buffer[Row](buffer_, buffer_size, csv.writerows)

        for _ in range(nrows + 1):
            buffer.push(generate_row(fake, config))

        buffer.flush(force=True)


if __name__ == "__main__":
    generate_file(filename=os.getenv('OUTFILE', ''),
                  config=CONFIGS[os.getenv('CONFIG', '')],
                  nrows=int(os.getenv('NROWS', '')))
