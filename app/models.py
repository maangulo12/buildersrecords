#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.models
    ~~~~~~~~~~~~~~~~~~

    This module implements the database models of this application.

    Current Models     Table Name
        -User          : users
        -Project       : projects
        -Category      : categories
        -Item          : items
        -Expenditure   : expenditure
        -Fund          : funds
        -Draw          : draws
        -Subcontractor : subcontractors

    More Info:
        -Flask-SQLAlchemy : http://flask-sqlalchemy.pocoo.org/2.1/api/
        -SQLAlchemy       : http://docs.sqlalchemy.org/en/latest/
"""

from datetime import datetime

from app import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(50), nullable=False, unique=True)
    username      = db.Column(db.String(30), nullable=False, unique=True)
    password      = db.Column(db.String, nullable=False)
    stripe_id     = db.Column(db.String, nullable=False)
    date_created  = db.Column(db.TIMESTAMP, nullable=False)
    active_until  = db.Column(db.TIMESTAMP, nullable=False)

    projects = db.relationship('Project', backref='users')

    def __init__(self, email, username, password, stripe_id):
        self.email        = email
        self.username     = username
        self.password     = bcrypt.generate_password_hash(password)
        self.stripe_id    = stripe_id
        self.date_created = datetime.now()
        # Needs work - get date a month from today
        self.active_until = datetime.now()

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


class Project(db.Model):
    __tablename__ = 'projects'
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(50), nullable=False)
    address       = db.Column(db.String(80), nullable=False)
    city          = db.Column(db.String(30), nullable=False)
    state         = db.Column(db.String(2), nullable=False)
    zipcode       = db.Column(db.String(10), nullable=False)
    home_sq       = db.Column(db.Integer, nullable=False)
    project_type  = db.Column(db.String(15), nullable=False)
    user_id       = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # timestamp

    items          = db.relationship('Item', backref='projects')
    categories     = db.relationship('Category', backref='projects')
    funds          = db.relationship('Fund', backref='projects')
    expenditures   = db.relationship('Expenditure', backref='projects')
    subcontractors = db.relationship('Subcontractor', backref='projects')


class Category(db.Model):
    __tablename__ = 'categories'
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(50), nullable=False)
    project_id    = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    items        = db.relationship('Item', backref='categories')
    expenditures = db.relationship('Expenditure', backref='categories')


class Item(db.Model):
    __tablename__ = 'items'
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(50), nullable=False)
    description   = db.Column(db.String(80))
    estimated     = db.Column(db.Numeric(12,2), nullable=False)
    actual        = db.Column(db.Numeric(12,2))
    category_id   = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    project_id    = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    expenditures = db.relationship('Expenditure', backref='items')


class Fund(db.Model):
    __tablename__ = 'funds'
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(50), nullable=False)
    loan          = db.Column(db.Boolean, nullable=False)
    amount        = db.Column(db.Numeric(12,2), nullable=False)
    project_id    = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    expenditures = db.relationship('Expenditure', backref='funds')
    draws        = db.relationship('Draw', backref='funds')


class Draw(db.Model):
    __tablename__ = 'draws'
    id            = db.Column(db.Integer, primary_key=True)
    date          = db.Column(db.Date, nullable=False)
    amount        = db.Column(db.Numeric(12,2), nullable=False)
    fund_id       = db.Column(db.Integer, db.ForeignKey('funds.id'), nullable=False)


class Expenditure(db.Model):
    __tablename__ = 'expenditures'
    id            = db.Column(db.Integer, primary_key=True)
    date          = db.Column(db.Date, nullable=False)
    vendor        = db.Column(db.String(50), nullable=False)
    notes         = db.Column(db.String(80))
    cost          = db.Column(db.Numeric(12,2), nullable=False)
    fund_id       = db.Column(db.Integer, db.ForeignKey('funds.id'), nullable=False)
    category_id   = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    item_id       = db.Column(db.Integer, db.ForeignKey('items.id'))
    project_id    = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    # image


class Subcontractor(db.Model):
    __tablename__  = 'subcontractors'
    id             = db.Column(db.Integer, primary_key=True)
    name           = db.Column(db.String(50), nullable=False)
    company        = db.Column(db.String(50), nullable=False)
    contact_number = db.Column(db.String(15))
    project_id     = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
