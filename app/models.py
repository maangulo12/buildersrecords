# -*- coding: utf-8 -*-

"""
    app.models
    ~~~~~~~~~~~~~~~~~~

    Application models
"""

from app.core import db


class User(db.Model):
    __tablename__ = 'users'

    id         = db.Column(db.Integer,    primary_key = True)
    username   = db.Column(db.String(25), nullable = False, unique = True)
    pw_hash    = db.Column(db.String(60), nullable = False)
    first_name = db.Column(db.String(30), nullable = False)
    last_name  = db.Column(db.String(30), nullable = False)
    email      = db.Column(db.String(50), nullable = False, unique = True)

    # projects = db.relationship('Project', backref = 'users')

    def __init__(self, username, pw_hash, first_name, last_name, email):
        self.username   = username
        self.pw_hash    = pw_hash
        self.first_name = first_name
        self.last_name  = last_name
        self.email      = email

    def __repr__(self):
        return "<User(username='%s', \
                      pw_hash='%s', \
                      first_name='%s', \
                      last_name='%s', \
                      email='%s')>" % (self.username,
                                       self.pw_hash,
                                       self.first_name,
                                       self.last_name,
                                       self.email)
