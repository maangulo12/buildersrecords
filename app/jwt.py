# -*- coding: utf-8 -*-

"""
    app.jwt
    ~~~~~~~~~~~

    JSON Web Token module
"""

from flask_jwt import jwt_required

from app import jwt
from app.settings import JWT_USERNAME, JWT_PASSWORD


class User(object):
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

@jwt.authentication_handler
def authenticate(username, password):
    if username == JWT_USERNAME and password == JWT_PASSWORD:
        return User(id = 1, username = JWT_USERNAME)

@jwt.user_handler
def load_user(payload):
    if payload['user_id'] == 1:
        return User(id = 1, username = JWT_USERNAME)

@jwt_required()
def auth_func(**kw):
    pass
