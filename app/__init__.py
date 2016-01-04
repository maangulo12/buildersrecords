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
        -Flask-Admin      : https://flask-admin.readthedocs.org/en/latest/
        -Stripe           : https://stripe.com/docs/api/python
"""

import stripe
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt
from flask.ext.restless import APIManager
from flask_mail import Mail
from flask.ext.migrate import Migrate
from flask_admin import Admin


db          = SQLAlchemy()
bcrypt      = Bcrypt()
api_manager = APIManager()
mail        = Mail()
migrate     = Migrate()
admin       = Admin(template_mode='bootstrap3')


def init_config(app):
    """
    Initializes the config variables of this application.
    """
    app.config.from_pyfile('settings.py')
    stripe.api_key = app.config['STRIPE_API_KEY']


def init_extensions(app):
    """
    Initializes the extensions of this application.
    """
    db.init_app(app)
    bcrypt.init_app(app)
    api_manager.init_app(app, flask_sqlalchemy_db=db)
    mail.init_app(app)
    migrate.init_app(app, db)
    admin.init_app(app)


def init_models():
    """
    Initializes the models of this application.
    """
    from app import models


def init_blueprints(app):
    """
    Registers the blueprints of this application.
    """
    from app import views
    from app import api_auth
    from app import api_email
    from app import api_subscriptions
    from app import api_uploads
    app.register_blueprint(views.bp)
    app.register_blueprint(api_auth.bp)
    app.register_blueprint(api_email.bp)
    app.register_blueprint(api_subscriptions.bp)
    app.register_blueprint(api_uploads.bp)


def create_app():
    """
    Creates a Flask application.
    """
    app = Flask(__name__)
    init_config(app)
    init_extensions(app)
    init_models()
    init_blueprints(app)
    return app


def run_app():
    """
    Runs the Flask application.
    """
    app = create_app()
    app.run(host=app.config['SERVER_HOST'], port=app.config['SERVER_PORT'])
