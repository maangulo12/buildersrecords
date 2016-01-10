#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.api.mail
    ~~~~~~~~~~~~

    This API is used for sending emails.

    Current APIs:
        -registration : /api/mail/registration (POST)
"""

from flask import request, make_response, render_template
from flask_mail import Message

from app import app, mail
from app.models import User


URL = '/api/mail'


# Needs route security
@app.route(URL + '/registration', methods=['POST'])
def registration():
    """
    Sends registration email to user.

    Request Example:
    POST
    {
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

    user = User.query.filter_by(email=email).first()

    if user is None:
        return make_response('User could not be found', 404)

    msg      = Message('Thank you from BuildersRecords', recipients=[email])
    msg.html = render_template('mail/registration.html', username=username)
    mail.send(msg)
    return make_response('Registration email was successfully sent', 200)
