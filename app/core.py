# -*- coding: utf-8 -*-

"""
    app.core
    ~~~~~~~~~~~~~~~~

    Core module
"""

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.migrate import Migrate
from flask.ext.script import Manager
from flask.ext.restless import APIManager

from app.settings import SECRET_KEY, DATABASE_URL


app = Flask(__name__, static_url_path = '')

# Configure variables
app.config.update(
    SECRET_KEY              = SECRET_KEY,
    SQLALCHEMY_DATABASE_URI = DATABASE_URL,
)

# Extensions
db          = SQLAlchemy(app)
migrate     = Migrate(app, db)
manager     = Manager(app)
api_manager = APIManager(app, flask_sqlalchemy_db = db)

# Index view
@app.route('/')
def index():
    return app.send_static_file("index.html")


from app import api
from app import models
from app import settings
