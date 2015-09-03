# -*- coding: utf-8 -*-

"""
    app.jwt
    ~~~~~~~~~~~

    JSON Web Token module
"""

from flask_jwt import jwt_required

from app import jwt


class User(object):
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

@jwt.authentication_handler
def authenticate(username, password):
    if username == 'joe' and password == 'pass':
        return User(id=1, username='joe')

@jwt.user_handler
def load_user(payload):
    if payload['user_id'] == 1:
        return User(id=1, username='joe')

@jwt_required()
def auth_func(**kw):
    pass
