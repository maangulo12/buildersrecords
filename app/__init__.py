# -*- coding: utf-8 -*-

"""
    app
    ~~~~~~~~~~~

    Application package

    :copyright: (c) 2015
"""

from flask import Flask
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth


# Flask Application
app = Flask(__name__, static_url_path = '')
app.config.from_pyfile('settings.py')

# Flask-Bcrypt
bcrypt = Bcrypt(app)

# Flask-SQLAlchemy
db = SQLAlchemy(app)

# Flask-HTTPAuth
auth = HTTPBasicAuth()

# App Modules
from app import models
from app import auth
from app import api
from app import views
