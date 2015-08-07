# -*- coding: utf-8 -*-

"""
    app
    ~~~~~~~~~~~

    Application package

    :copyright: (c) 2015 by Miguel Angulo
"""

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt
from flask.ext.restless import APIManager


# Flask Application
app = Flask(__name__, static_url_path = '')
from app import settings
from app import views

# Flask-SQLAlchemy
db = SQLAlchemy(app)
from app import models
db.create_all()

# Flask-Bcrypt
bcrypt = Bcrypt(app)

# Flask-Restless
api_manager = APIManager(app, flask_sqlalchemy_db = db)
from app import api
