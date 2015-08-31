# -*- coding: utf-8 -*-

"""
    app.auth
    ~~~~~~~~~~~

    Authentication module
"""

from flask import g

from app import auth
from app.models import User


@auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username = username).first()
    if not user or not user.check_password(password):
        return False
    g.user = user
    return True
