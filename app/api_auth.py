#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_auth
    ~~~~~~~~~~~~

    This module is used for authenticating users.

    Current APIs:
        -auth     : /api/auth          (POST)
        -email    : /api/auth/email    (POST)
        -username : /api/auth/username (POST)
"""

import jwt
from flask import request, jsonify, make_response, current_app, json
from flask.ext.restless import ProcessingException

from app import app
from app.models import User


API_ENTRY = '/api/auth'


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

    # Check if account is active (active_until)

    if user and user.check_password(password):
        token = jwt.encode(dict(
            user_id=user.id,
            username=user.username,
            email=user.email,
            stripe_id=user.stripe_id,
            date_created=json.dumps(user.date_created),
            active_until=json.dumps(user.active_until)
            ),
            current_app.config['AUTH_SECRET']
        )
        return make_response(jsonify(token=token.decode('utf-8')), 200)
    else:
        return make_response('Unauthorized', 401)


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
        return make_response('Email already exists', 302)


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
        return make_response('Username already exists', 302)


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
        payload = jwt.decode(
            parts[1],
            current_app.config['AUTH_SECRET'],
            options=dict(verify_exp=current_app.config['AUTH_VERIFY_EXP'])
        )
        user = User.query.filter_by(
            id=payload['user_id'],
            username=payload['username']
        ).first()

        if user is None:
            raise ProcessingException('User does not exist', 401)

    except jwt.InvalidTokenError:
        raise ProcessingException('Token is invalid', 400)

# NEED verify decorator
