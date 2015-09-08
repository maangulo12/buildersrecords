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
from flask_jwt import JWT
from flask.ext.restless import APIManager
from flask_mail import Mail


# Flask Application
app = Flask(__name__, static_url_path = '')
app.config.from_pyfile('settings.py')
from app import views

# Flask-Bcrypt
bcrypt = Bcrypt(app)

# Flask-SQLAlchemy
db = SQLAlchemy(app)
from app import models

# Flask-JWT
jwt = JWT(app)
from app import jwt

# Flask-Restless
api_manager = APIManager(app, flask_sqlalchemy_db = db)
from app import api

# Flask-Mail
mail_service = Mail(app)
from app import mail
