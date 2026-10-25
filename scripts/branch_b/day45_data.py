# -*- coding: utf-8 -*-
"""
Day 45 Data Loader
"""

import json
import os

_p = os.path.join(os.path.dirname(__file__), 'day45_data.json')
with open(_p, 'r', encoding='utf-8') as _f:
    day45_data = json.load(_f)
