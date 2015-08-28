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
from flask_restful import Api
from flask_httpauth import HTTPBasicAuth


# Flask Application
app = Flask(__name__, static_url_path = '')
app.config.from_pyfile('settings.py')
from app import views

# Flask-Bcrypt
bcrypt = Bcrypt(app)

# Flask-SQLAlchemy
db = SQLAlchemy(app)
from app import models
db.create_all()

# Flask-RESTful
api_manager = Api(app)
from app import api

# Flask-HTTPAuth
auth = HTTPBasicAuth()
