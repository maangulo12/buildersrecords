#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    BuildersRecords
    --------------------
    :copyright: (c) 2015

    Run this module to deploy the application.

    -How to run it (type the following in the command-line):
        python3 application.py
"""

from app import app
from app.settings import SERVER_HOST, SERVER_PORT, SERVER_DEBUG


if __name__ == '__main__':
    app.run(host=SERVER_HOST, port=SERVER_PORT, debug=SERVER_DEBUG)
