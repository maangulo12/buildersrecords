# -*- coding: utf-8 -*-

"""
    app.jwt
    ~~~~~~~~~~~

    This is the JSON Web Token module. It is used for authenticating users
    to the API of this application.
"""

from flask import g
from flask_jwt import jwt_required

from app import jwt
from app.models import User


class JWT_User(object):
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

@jwt.authentication_handler
def authenticate(username, password):
    g.user = User.query.filter_by(username = username).first()
    if g.user is None:
        g.user = User.query.filter_by(email = username).first()

    if g.user is not None and g.user.check_password(password):
        return JWT_User(id = 1, username = g.user.username)

@jwt.user_handler
def load_user(payload):
    if payload['user_id'] == 1:
        return JWT_User(id = 1, username = g.user.username)

@jwt_required()
def auth_func(**kw):
    pass
