#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.jwt
    ~~~~~~~~~~~

    This is the JSON Web Token module. It is used for authenticating users
    to the API of this application.

    Current APIs:
        -auth : /api/auth
"""

import jwt
from flask import request, jsonify, make_response, current_app
from flask.ext.restless import ProcessingException

from app import app
from app.models import User


def encode_token(user):
    """
    This function is used to create the json web token.
    """
    return jwt.encode({'user_id': user.id, 'username': user.username},
                      current_app.config['AUTH_SECRET'])


def decode_token(token):
    """
    This function is used to decode the json web token.
    """
    return jwt.decode(token, current_app.config['AUTH_SECRET'],
                      options={'verify_exp': current_app.config['AUTH_VERIFY_EXP']})


@app.route('/api/auth', methods=['POST'])
def auth():
    """
    This route is used for authentication.

    POST request needs:
        login    : 'username' or 'email address'
        password : 'password'
    """
    data      = request.get_json(force=True)
    login     = data.get('login', None)
    password  = data.get('password', None)

    criterion = [login, password, len(data) == 2]

    if not all(criterion):
        return make_response('Bad Request', 400)

    user = User.query.filter_by(username=login).first()

    if user is None:
        user = User.query.filter_by(email=login).first()

    if user and user.check_password(password):
        token = encode_token(user)
        return make_response(jsonify({'token': token.decode('utf-8')}), 200)
    else:
        return make_response('Unauthorized', 401)


def verify_jwt(*args, **kwargs):
    """
    This function is used to verify the json web token.
    """
    auth = request.headers.get('Authorization', None)

    if auth is None:
        raise ProcessingException('Authorization header was missing', 401)

    parts = auth.split()

    if parts[0].lower() != current_app.config['AUTH_HEADER_PREFIX'].lower():
        raise ProcessingException('Unsupported authorization type', 400)
    elif len(parts) == 1:
        raise ProcessingException('Token missing', 400)
    elif len(parts) > 2:
        raise ProcessingException('Token contains spaces', 400)

    try:
        payload = decode_token(parts[1])
        user = User.query.filter_by(
            id=payload['user_id'], username=payload['username']).first()

        if user is None:
            raise ProcessingException('User does not exist', 401)

    except jwt.InvalidTokenError:
        raise ProcessingException('Token is invalid', 400)


# add decorator function
