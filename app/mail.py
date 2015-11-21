#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.mail
    ~~~~~~~~~~~~~~

    This is the module used for sending emails to users.

    Current APIs:
        -registration : /api/email/registration
"""

from flask import make_response, render_template, request
from flask_mail import Message

from app import app, mail_service


API_ENTRY = '/api/email'


# add route protection
@app.route(API_ENTRY + '/registration', methods=['POST'])
def registration():
    data       = request.get_json(force=True)
    email      = data.get('email', None)
    username   = data.get('username', None)
    criterion  = [email, username, len(data) == 2]

    if not all(criterion):
        return make_response('Registration email could not be sent', 400)

    msg = Message("Thank you from BuildersRecords", recipients=[email])
    msg.html = render_template('email/registration.html', username=username)
    # mail_service.send(msg)
    return make_response('Registration email was sent', 201)
