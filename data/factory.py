from csv import DictWriter
import os
from typing import List

from faker import Faker

from .configs import CONFIGS
from .helpers import Config
from .helpers import Row

DATA_DIR = os.path.dirname(os.path.abspath(__file__))


def generate_file(filename: str, config: Config, nrows: int) -> None:
    """
    Generate a test data file conforming to the given config.

    Args:
        * filename: csv file to be stored in data/
        * config: One of (floodlight_report,)
        * nrows: number of rows to generate
    """
    with open(os.path.join(DATA_DIR, filename), 'w+') as f:

        columns = [column.bq_name for column in config]
        csv = DictWriter(f, fieldnames=columns)
        csv.writeheader()

        fake = Faker(
            use_weighting=False,  # perf > randomness
        )

        buffer: List[Row] = []
        batch_size = nrows // 100

        for i in range(nrows + 1):

            row: Row = {}
            for column in config:
                row[column.bq_name] = column.value(fake)

            buffer.append(row)

            if i % batch_size == 0:
                csv.writerows(buffer)
                buffer.clear()


if __name__ == "__main__":
    generate_file(filename=os.environ['OUTFILE'],
                  config=CONFIGS[os.environ['CONFIG']],
                  nrows=int(os.environ['NROWS']))
