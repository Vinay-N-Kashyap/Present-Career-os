# -*- coding: utf-8 -*-
"""
Day 44 Data Loader
"""

import json
import os

_p = os.path.join(os.path.dirname(__file__), 'day44_data.json')
with open(_p, 'r', encoding='utf-8') as _f:
    day44_data = json.load(_f)
