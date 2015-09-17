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
        -Flask-JWT        : https://pythonhosted.org/Flask-JWT/
        -Flask-Restless   : http://flask-restless.readthedocs.org/en/latest/
        -Flask-Mail       : http://pythonhosted.org/Flask-Mail/
"""

from flask import Flask
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
from flask_jwt import JWT
from flask.ext.restless import APIManager
from flask_mail import Mail


# Flask application
app = Flask(__name__, static_url_path = '')
# Configure this application from 'settings.py' module
app.config.from_pyfile('settings.py')
# Import all of the views to this application
from app import views

# Flask-Bcrypt: Used for hashing passwords
bcrypt = Bcrypt(app)

# Flask-SQLAlchemy: Used for creating database models (using SQLAlchemy)
db = SQLAlchemy(app)
# Import all of the models to this application
from app import models

# Flask-JWT: Used for authentication (JSON Web Token)
jwt = JWT(app)
# Import jwt module to this application
from app import jwt

# Flask-Restless: Used for generating RESTful APIs from database models
api_manager = APIManager(app, flask_sqlalchemy_db = db)
# Import API module to this application
from app import api

# Flask-Mail: Used for sending emails
mail_service = Mail(app)
# Import mail module to this application
from app import mail
