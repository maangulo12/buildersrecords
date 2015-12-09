#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app
    ~~~~~~~~~~~
    :copyright: (c) 2015

    This is the core module of this application.

    Flask and extensions:
        -Flask            : http://flask.pocoo.org/
        -Flask-Bcrypt     : http://flask-bcrypt.readthedocs.org/en/latest/
        -Flask-SQLAlchemy : http://pythonhosted.org/Flask-SQLAlchemy/
        -Flask-Restless   : http://flask-restless.readthedocs.org/en/latest/
        -Flask-Mail       : http://pythonhosted.org/Flask-Mail/
"""

from flask import Flask
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager
from flask_mail import Mail


# Flask application
app = Flask(__name__)
app.config.from_pyfile('settings.py')
from app import views

# Flask-Bcrypt
bcrypt = Bcrypt(app)

# Models
db = SQLAlchemy(app)
from app import models

# API Authentication
from app import api_auth

# API Models
api_manager = APIManager(app, flask_sqlalchemy_db=db)
from app import api_models

# API Email
email = Mail(app)
from app import api_email

# API Uploads
from app import api_uploads

# API Subscriptions
from app import api_subscriptions
