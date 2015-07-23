# -*- coding: utf-8 -*-

"""
    app.settings
    ~~~~~~~~~~~~~~~~~~~~

    Settings module
"""

import os


# App Key
SECRET_KEY   =  os.environ.get('SECRET_KEY', 'secret_key')

# WSGI Server
SERVER_HOST  =  os.environ.get('SERVER_HOST', '0.0.0.0')
SERVER_PORT  =  int(os.environ.get('SERVER_PORT', 5555))
DEBUG_FLAG   =  True

# Local DB Settings
DB_ENGINE    = 'postgresql'
DB_USERNAME  = 'postgres'
DB_PASSWORD  = 'password'
DB_SERVER    = 'localhost'
DB_PORT      = '5432'
DB_NAME      = 'app_db'

# Production DB URL
DATABASE_URL =  os.environ.get('DATABASE_URL', DB_ENGINE + '://' +
                                               DB_USERNAME + ':' +
                                               DB_PASSWORD + '@' +
                                               DB_SERVER + ':' +
                                               DB_PORT + '/' +
                                               DB_NAME)
