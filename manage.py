#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    manage.py
    ---------------

    This module is used as a utility module for doing quick
    commands in this application.

    -Commands:
        create_db : Creates all of the tables in the database.
        drop_db   : Drops all of the tables from the database.
        recreate  : Drops all of the tables and recreates them.
        runserver : Runs this Flask application.
        runtests  : Runs tests.py using nose.
        db        : Performs database migrations.
        shell     : Runs a Python shell using IPython.

    -How to use this module (type the following in the command-line):
        1. Type this to see the available commands:
            python3 manage.py

        2. Or type this to execute command:
            python3 manage.py (insert command here)
"""

import os
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.script import Manager

from app import app, db
from app.settings import SERVER_HOST, SERVER_PORT, DEBUG_FLAG


migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

@manager.command
def create_db():
    "Creates all of the tables in the database."
    print('Creating all of the tables in the database...')
    db.create_all()

@manager.command
def drop_db():
    "Drops all of the tables from the database."
    print('Dropping all of the tables from the database...')
    db.drop_all()

@manager.command
def recreate():
    "Drops all of the tables and recreates them."
    drop_db()
    create_db()

@manager.command
def runserver():
    "Runs this Flask application."
    app.run(host = SERVER_HOST, port = SERVER_PORT, debug = DEBUG_FLAG)

@manager.command
def runtests():
    "Runs tests.py using nose."
    os.system('nosetests tests/tests.py')

if __name__ == "__main__":
    manager.run()
