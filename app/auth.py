# -*- coding: utf-8 -*-

"""
    app.auth
    ~~~~~~~~~~~

    Authentication module
"""

from flask import g
from flask_httpauth import HTTPBasicAuth

from app.models import Admin

# Flask-HTTPAuth
auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    g.admin = Admin.query.filter_by(username = username).first()
    if g.admin is None:
        return False
    return g.admin.check_password(password)
