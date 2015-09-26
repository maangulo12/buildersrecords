# -*- coding: utf-8 -*-

"""
    app.jwt
    ~~~~~~~~~~~

    This is the JSON Web Token module. It is used for authenticating users
    to the API of this application.
"""

import jwt
from flask import request, jsonify, make_response
from flask.ext.restless import ProcessingException

from app import app
from app.models import User


def encode_token(user):
    return jwt.encode({ 'user_id': user.id, 'username': user.username }, 'secret')


def decode_token(token):
    return jwt.decode(token, 'secret', options = { 'verify_exp': False })


@app.route('/auth', methods = ['POST'])
def auth():
    data = request.get_json(force = True)
    login = data.get('login', None)
    password = data.get('password', None)
    criterion = [login, password, len(data) == 2]

    if not all(criterion):
        return make_response('Bad Request', 400)

    user = User.query.filter_by(username = login).first()

    if user is None:
        user = User.query.filter_by(email = login).first()

    if user and user.check_password(password):
        token = encode_token(user)
        return jsonify({ 'token': token.decode('utf-8') })
    else:
        return make_response('Unauthorized', 401)


def verify_jwt(*args, **kwargs):
    auth = request.headers.get('Authorization', None)

    if auth is None:
        raise ProcessingException('Authorization header was missing', 401)

    parts = auth.split()

    if parts[0].lower() != 'Bearer'.lower():
        raise ProcessingException('Unsupported authorization type', 400)
    elif len(parts) == 1:
        raise ProcessingException('Token missing', 400)
    elif len(parts) > 2:
        raise ProcessingException('Token contains spaces', 400)

    try:
        payload = decode_token(parts[1])
        user = User.query.filter_by(id = payload['user_id'], username = payload['username']).first()

        if user is None:
            raise ProcessingException('User does not exist', 401)

    except jwt.InvalidTokenError:
        raise ProcessingException('Token is invalid', 400)
