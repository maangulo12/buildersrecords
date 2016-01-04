#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    manage.py
    ~~~~~~~~~

    This module is used for doing quick commands in this application.

    -Commands:
        create    : Creates all of the tables in the database.
        drop      : Drops all of the tables from the database.
        populate  : Populates the database with sample data.
        recreate  : Drops, recreates, and populates the tables in the database.
        runtests  : Runs tests to this application using nose.
        db        : Performs database migrations.
        shell     : Runs a Python shell using IPython.

    -How to use this module (type the following in the command-line):
        1. Type the following to see the available commands:
            python3 manage.py

        2. Or type the following to execute command:
            python3 manage.py (insert command here)
"""

import os
from flask.ext.migrate import MigrateCommand

from app import manager, db
from tests.sample_data import populate_db


# Add db command for database migrations
manager.add_command('db', MigrateCommand)


@manager.command
def create():
    "Creates all of the tables in the database."
    db.create_all()
    print('Created all of the tables in the database.')


@manager.command
def drop():
    "Drops all of the tables from the database."
    db.drop_all()
    print('Dropped all of the tables from the database.')


@manager.command
def populate():
    "Populates the database with sample data."
    populate_db()
    print('Populated the database with sample data.')


@manager.command
def recreate():
    "Drops, recreates, and populates the tables in the database."
    drop()
    create()
    populate()


@manager.command
def runtests():
    "Runs tests to this application using nose."
    os.system('nosetests tests/tests.py')
    print('Finished running all tests.')


if __name__ == "__main__":
    manager.run()
