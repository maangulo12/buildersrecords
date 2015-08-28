# -*- coding: utf-8 -*-

"""
    app.models
    ~~~~~~~~~~~~~~~~~~

    Application models
"""

from app import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'
    id         = db.Column(db.Integer,    primary_key = True)
    username   = db.Column(db.String(25), nullable = False, unique = True)
    pw_hash    = db.Column(db.String(60), nullable = False)
    first_name = db.Column(db.String(30), nullable = False)
    last_name  = db.Column(db.String(30), nullable = False)
    email      = db.Column(db.String(50), nullable = False, unique = True)

    projects = db.relationship('Project', backref = 'users')

    def __init__(self, username, pw_hash, first_name, last_name, email):
        self.username   = username
        self.pw_hash    = bcrypt.generate_password_hash(pw_hash)
        self.first_name = first_name
        self.last_name  = last_name
        self.email      = email

    def password_match(self, password):
        return bcrypt.check_password_hash(self.pw_hash, password)


class Project(db.Model):
    __tablename__ = 'projects'
    id           = db.Column(db.Integer,    primary_key = True)
    project_name = db.Column(db.String(50), nullable = False)
    project_type = db.Column(db.String(30), nullable = False)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'))

    categories = db.relationship('Category', backref = 'projects')


class Category(db.Model):
    __tablename__ = 'categories'
    id            = db.Column(db.Integer,    primary_key = True)
    category_name = db.Column(db.String(50), nullable = False)
    project_id    = db.Column(db.Integer, db.ForeignKey('projects.id'))

    items = db.relationship('Item', backref = 'categories')


class Item(db.Model):
    __tablename__ = 'items'
    id          = db.Column(db.Integer,       primary_key = True)
    item_name   = db.Column(db.String(50),    nullable = False)
    description = db.Column(db.String(80),    nullable = False)
    budget      = db.Column(db.Numeric(11,2), nullable = False)
    actual      = db.Column(db.Numeric(11,2), nullable = False)
    notes       = db.Column(db.String(80),    nullable = False)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
