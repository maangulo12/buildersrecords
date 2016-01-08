#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.api.auth
    ~~~~~~~~~~~~

    This API is used for authentication.

    Current endpoints:
        -auth     : /api/auth          (POST)
        -email    : /api/auth/email    (POST)
        -username : /api/auth/username (POST)
"""

import jwt
from flask import request, jsonify, make_response

from app import app
from app.models import User


URL = '/api/auth'


@app.route(URL, methods=['POST'])
def authentication():
    """
    Authenticates a user and sends a token.

    Request Example:
    POST
    {
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
            stripe_id=user.stripe_id
            ),
            app.config['AUTH_SECRET']
        )
        return make_response(jsonify(token=token), 200)
    else:
        return make_response('Unathenticated', 401)


@app.route(URL + '/email', methods=['POST'])
def verify_email():
    """
    Verifies if email address already exists.

    Request Example:
    POST
    {
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
        return make_response('Valid email address', 200)
    else:
        return make_response('Email address already exists', 302)


@app.route(URL + '/username', methods=['POST'])
def verify_username():
    """
    Verifies if username already exists.

    Request Example:
    POST
    {
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
