#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.api.api_auth
    ~~~~~~~~~~~~~~~~

    This API is used for authenticating users.

    Current APIs:
        -auth     : /api/auth          (POST)
        -email    : /api/auth/email    (POST)
        -username : /api/auth/username (POST)
"""

import jwt
from flask import Blueprint, request, jsonify, make_response, current_app

from app import app
from app.models import User


bp = Blueprint('auth', __name__, url_prefix='/api')


@bp.route('/auth', methods=['POST'])
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
            stripe_id=user.stripe_id
            ),
            current_app.config['AUTH_SECRET']
        )
        return make_response(jsonify(token=token.decode('utf-8')), 200)
    else:
        return make_response('Unauthorized', 401)


@bp.route('/auth/email', methods=['POST'])
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


@bp.route('/auth/username', methods=['POST'])
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


app.register_blueprint(bp)
