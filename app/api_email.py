#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_email
    ~~~~~~~~~~~~~~

    This module is used for sending emails to users.

    Current APIs:
        -registration : /api/email/registration (POST)
"""

from flask import make_response, render_template, request
from flask_mail import Message

from app import app, email


API_ENTRY = '/api/email'


# Needs route security
@app.route(API_ENTRY + '/registration', methods=['POST'])
def registration():
    """
    Sends registration email to user.

    POST: {
        email    : 'email address'
        username : 'username'
    }
    """
    data      = request.get_json(force=True)
    email     = data.get('email', None)
    username  = data.get('username', None)
    criterion = [email, username, len(data) == 2]

    if not all(criterion):
        return make_response('Bad Request', 400)

    # Check if email and username exist

    msg      = Message("Thank you from BuildersRecords", recipients=[email])
    msg.html = render_template('email/registration.html', username=username)
    # email.send(msg)
    return make_response('Success! Registration email was sent', 201)
