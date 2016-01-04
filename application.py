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

from app import create_app
from app.settings import SERVER_HOST


def run_app():
    """
        Runs the Flask application.
    """
    # Create the application
    app = create_app()
    # Run the application
    app.run(host=SERVER_HOST)


if __name__ == '__main__':
    run_app()
