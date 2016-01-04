#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    BuildersRecords
    ~~~~~~~~~~~~~~~
    :copyright: (c) 2016

    Run this module to deploy the application.

    -How to run it (type the following in the command-line):
        python3 application.py
"""

from app import app


if __name__ == '__main__':
    app.run(host=app.config['SERVER_HOST'], port=app.config['SERVER_PORT'])
