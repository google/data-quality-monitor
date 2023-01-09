from typing import Dict

from .helpers import Column
from .helpers import Config
from .helpers import words_string

# short alias
C = Column

CONFIGS: Dict[str, Config] = {
    'cm360_floodlight_report': [
        C('Activity', 'STRING', lambda f: words_string(f, 3)),
        C('Activity ID', 'INT64', lambda f: f.pyint()),
        C('Activity Date/Time', 'DATETIME', lambda f: f.iso8601()),
        C('Campaign', 'STRING', lambda f: words_string(f, 3)),
        C('Campaign ID', 'INT64', lambda f: f.pyint()),
        C('Site (CM360)', 'STRING', lambda f: f.word()),
        C('Placement', 'STRING', lambda f: words_string(f, 2)),
        C('Creative', 'STRING', lambda f: words_string(f, 2)),
        C('Date', 'DATE', lambda f: f.date()),
        C('Click-through Conversions', 'INT64', lambda f: f.pyint()),
        C('View-through Conversions', 'INT64', lambda f: f.pyint()),
        C('Total Conversions', 'INT64', lambda f: f.pyint()),
        C('Total Revenue', 'INT64', lambda f: f.pyint()),
        C('Custom Variable String', 'STRING', lambda f: f.word()),
        C('Custom Variable Integer', 'INT64', lambda f: f.pyint()),
        C('Custom Variable Float', 'FLOAT64', lambda f: f.pyfloat()),
    ]
}
