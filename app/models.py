# -*- coding: utf-8 -*-

"""
    app.models
    ~~~~~~~~~~~~~~~~~~

    This module implements all of the database models of this application.

    Current Models:
        -User        : users
        -Project     : projects
        -Category    : categories
        -Item        : items
        -Expenditure : expenditure
        -Fund        : funds
        -Draw        : draws
"""

from app import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    password = db.Column(db.String(60), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    # timestamp

    projects = db.relationship('Project', backref='users')

    def __init__(self, username, password, first_name, last_name, email):
        self.username = username
        self.password = bcrypt.generate_password_hash(password)
        self.first_name = first_name
        self.last_name = last_name
        self.email = email

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    # project_type = db.Column(db.String(30), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # timestamp

    items = db.relationship('Item', backref='projects')
    categories = db.relationship('Category', backref='projects')
    funds = db.relationship('Fund', backref='projects')
    expenditures = db.relationship('Expenditure', backref='projects')


class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    items = db.relationship('Item', backref='categories')
    expenditures = db.relationship('Expenditure', backref='categories')


class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(80), nullable=False)
    amount = db.Column(db.Numeric(12,2), nullable=False)
    notes = db.Column(db.String(80))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    expenditures = db.relationship('Expenditure', backref='items')


class Fund(db.Model):
    __tablename__ = 'funds'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    loan = db.Column(db.Boolean, nullable=False)
    amount = db.Column(db.Numeric(12,2), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    expenditures = db.relationship('Expenditure', backref='funds')
    draws = db.relationship('Draw', backref='funds')


class Draw(db.Model):
    __tablename__ = 'draws'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Numeric(12,2), nullable=False)
    fund_id = db.Column(db.Integer, db.ForeignKey('funds.id'))


class Expenditure(db.Model):
    __tablename__ = 'expenditures'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    vendor = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(80), nullable=False)
    amount = db.Column(db.Numeric(12,2), nullable=False)
    notes = db.Column(db.String(80))
    # image = db.Column(db.LargeBinary, nullable = False)
    fund_id = db.Column(db.Integer, db.ForeignKey('funds.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
