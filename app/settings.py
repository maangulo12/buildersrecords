# -*- coding: utf-8 -*-

"""
    app.settings
    ~~~~~~~~~~~~~~~~~~~~

    This module contains all of the config variables of this application.
"""

import os


# Flask application secret key
SECRET_KEY = os.environ.get('SECRET_KEY', 'secret_key')

# WSGI server
SERVER_HOST = os.environ.get('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.environ.get('SERVER_PORT', 5555))
SERVER_DEBUG = True

# Uploads path
UPLOAD_PATH = os.environ.get('UPLOAD_PATH', '/uploads/')

# API Auth
AUTH_HEADER_PREFIX = os.environ.get('AUTH_HEADER_PREFIX', 'Bearer')
AUTH_VERIFY_EXP = False
AUTH_SECRET = os.environ.get('AUTH_SECRET', 'secret')

# Email provider settings
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 465
MAIL_USE_SSL = True
MAIL_DEBUG = True
MAIL_USERNAME = os.environ.get('MAIL_USERNAME',
                               'buildersrecords.app@gmail.com')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD' 'buildersrecords123')
MAIL_DEFAULT_SENDER = ('BuildersRecords', MAIL_USERNAME)

# Local DB settings
DB_ENGINE = 'postgresql'
DB_USERNAME = 'postgres'
DB_PASSWORD = 'password'
DB_SERVER = 'localhost'
DB_PORT = '5432'
DB_NAME = 'app_db'

# Production DB URL
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
                                         DB_ENGINE + '://' +
                                         DB_USERNAME + ':' +
                                         DB_PASSWORD + '@' +
                                         DB_SERVER + ':' +
                                         DB_PORT + '/' +
                                         DB_NAME)
