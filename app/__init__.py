#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app package
    ~~~~~~~~~~~
    :copyright: (c) 2016

    This is the core package of this application.

    Flask and extensions:
        -Flask            : http://flask.pocoo.org/
        -Flask-SQLAlchemy : http://pythonhosted.org/Flask-SQLAlchemy/
        -Flask-Bcrypt     : http://flask-bcrypt.readthedocs.org/en/latest/
        -Flask-Restless   : http://flask-restless.readthedocs.org/en/latest/
        -Flask-Mail       : http://pythonhosted.org/Flask-Mail/
        -Flask-Migrate    : http://flask-migrate.readthedocs.org/en/latest/
        -Flask-Script     : http://flask-script.readthedocs.org/en/latest/
        -Flask-Admin      : https://flask-admin.readthedocs.org/en/latest/
        -Flask-Assets     : http://flask-assets.readthedocs.org/en/latest/
        -Stripe           : https://stripe.com/docs/api/python
"""

import stripe
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt
from flask.ext.restless import APIManager
from flask_mail import Mail
from flask.ext.migrate import Migrate
from flask.ext.script import Manager
from flask_admin import Admin
from flask.ext.assets import Environment


# Create Flask application
app = Flask(__name__)

# Configurations
app.config.from_pyfile('settings.py')

# Stripe
stripe.api_key = app.config['STRIPE_API_KEY']

# Extensions
db       = SQLAlchemy(app)
bcrypt   = Bcrypt(app)
restless = APIManager(app, flask_sqlalchemy_db=db)
mail     = Mail(app)
migrate  = Migrate(app, db)
manager  = Manager(app)
admin    = Admin(app, template_mode='bootstrap3')
assets   = Environment(app)

# Models
from app import models

# Views
from app import views

# API
from app.api import auth
from app.api import api_email
from app.api import api_subscriptions
from app.api import api_uploads
from app.api import api_models

# Admin
from app import admin
