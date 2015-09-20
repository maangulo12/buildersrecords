# -*- coding: utf-8 -*-

"""
    app.jwt
    ~~~~~~~~~~~

    This is the JSON Web Token module. It is used for authenticating users
    to the API of this application.
"""

from flask_jwt import jwt_required

from app import jwt
from app.models import User


class JWT_User(object):
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

@jwt.authentication_handler
def authenticate(username, password):
    user = User.query.filter_by(username = username).first()
    if user is None:
        user = User.query.filter_by(email = username).first()

    if user is not None and user.check_password(password):
        return JWT_User(id = user.id, username = user.username)

@jwt.user_handler
def load_user(payload):
    user = User.query.filter_by(id = payload['user_id'], username = payload['username']).first()
    if user is not None:
        return JWT_User(id = user.id, username = user.username)

@jwt.payload_handler
def make_payload(user):
    return {
        'user_id': user.id,
        'username': user.username
    }

@jwt_required()
def auth_func(**kw):
    pass
