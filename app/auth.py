#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.auth
    ~~~~~~~~

    This module is used for authenticating users.
"""

import jwt
from flask import request, current_app
from flask.ext.restless import ProcessingException

from app.models import User


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
            stripe_id=payload['stripe_id']
        ).first()

        if user is None:
            raise ProcessingException('User does not exist', 401)

    except jwt.InvalidTokenError:
        raise ProcessingException('Token is invalid', 400)

# NEED verify decorator
