#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_auth
    ~~~~~~~~~~~~

    This module is used for authenticating users.

    Current APIs:
        -auth     : /api/auth (authenticates user)
        -email    : /api/auth/email (checks if email already exists)
        -username : /api/auth/username (checks if username already exists)
"""

import jwt
from flask import request, jsonify, make_response, current_app
from flask.ext.restless import ProcessingException

from app import app
from app.models import User


API_ENTRY = '/api/auth'


def encode_token(user):
    """
    Creates JSON web token.
    """
    return jwt.encode({'user_id': user.id, 'username': user.username},
                      current_app.config['AUTH_SECRET'])


def decode_token(token):
    """
    Decodes JSON web token.
    """
    return jwt.decode(token, current_app.config['AUTH_SECRET'],
                      options={'verify_exp': current_app.config['AUTH_VERIFY_EXP']})


# Needs route security
@app.route(API_ENTRY, methods=['POST'])
def auth():
    """
    Authenticates user.

    POST: {
        login    : 'username' or 'email address'
        password : 'password'
    }
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


# Needs route security
@app.route(API_ENTRY + '/email', methods=['POST'])
def check_email():
    """
    Checks if email address exists.

    POST: {
        email : 'email address'
    }
    """
    data      = request.get_json(force=True)
    email     = data.get('email', None)
    criterion = [email, len(data) == 1]

    if not all(criterion):
        return make_response('Bad Request', 400)

    user = User.query.filter_by(email=email).first()

    if user is None:
        return make_response('Valid email', 200)
    else:
        return make_response('Email already exists', 400)


# Needs route security
@app.route(API_ENTRY + '/username', methods=['POST'])
def check_username():
    """
    Checks if username exists.

    POST: {
        username : 'username'
    }
    """
    data      = request.get_json(force=True)
    username  = data.get('username', None)
    criterion = [username, len(data) == 1]

    if not all(criterion):
        return make_response('Bad Request', 400)

    user = User.query.filter_by(username=username).first()

    if user is None:
        return make_response('Valid username', 200)
    else:
        return make_response('Username already exists', 400)


def verify_jwt(*args, **kwargs):
    """
    Verifies JSON web token.
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
        user = User.query.filter_by(id=payload['user_id'],
                                    username=payload['username']).first()

        if user is None:
            raise ProcessingException('User does not exist', 401)

    except jwt.InvalidTokenError:
        raise ProcessingException('Token is invalid', 400)
