# -*- coding: utf-8 -*-

"""
    BuildersRecords
    --------------------
    :copyright: (c) 2015


    To deploy this application, run this module.

    -How to run it (type the following in the command-line):
        python3 application.py
"""

from app import app
from app.settings import SERVER_HOST, SERVER_PORT, DEBUG_FLAG


if __name__ == '__main__':
    app.run(host = SERVER_HOST, port = SERVER_PORT, debug = DEBUG_FLAG)
