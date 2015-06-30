# -*- coding: utf-8 -*-

"""
    app.core
    ~~~~~~~~~~~

    Core module
"""

from flask import Flask
from flask.ext.script import Manager
from flask.ext.sqlalchemy import SQLAlchemy

from app.settings import SECRET_KEY, DATABASE_URL
from app.api.users import users


app = Flask(__name__)

# Configure variables
app.config.update(
    SECRET_KEY              = SECRET_KEY,
    SQLALCHEMY_DATABASE_URI = DATABASE_URL,
)

# Register blueprints
app.register_blueprint(users)

# Extensions
manager = Manager(app)
db      = SQLAlchemy(app)


from app import models
from app import settings
from app import views
