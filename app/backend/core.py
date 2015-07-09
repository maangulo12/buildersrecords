# -*- coding: utf-8 -*-

"""
    app.backend.core
    ~~~~~~~~~~~~~~~~

    Core module
"""

from flask import Flask
from flask.ext.script import Manager
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.migrate import Migrate, MigrateCommand
# from flask.ext.triangle import Triangle

from app.backend.settings import SECRET_KEY, DATABASE_URL
from app.backend.api.users import users


app = Flask(__name__, static_folder   = '../frontend/static',
                      template_folder = '../frontend/templates')

# Configure variables
app.config.update(
    SECRET_KEY              = SECRET_KEY,
    SQLALCHEMY_DATABASE_URI = DATABASE_URL,
)

# Register blueprints
app.register_blueprint(users)

# Extensions
db       = SQLAlchemy(app)
migrate  = Migrate(app, db)
# triangle = Triangle(app)
manager  = Manager(app)
manager.add_command('db', MigrateCommand)


from app.backend import models
from app.backend import settings
from app.backend import views
