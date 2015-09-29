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
app = Flask(__name__, static_url_path='')
app.config.from_pyfile('settings.py')
from app import views

# Flask-Bcrypt
bcrypt = Bcrypt(app)

# Flask-SQLAlchemy
db = SQLAlchemy(app)
from app import models

# JWT
from app import jwt

# Flask-Restless
api_manager = APIManager(app, flask_sqlalchemy_db=db)
from app import api

# Flask-Mail
mail_service = Mail(app)
from app import mail
