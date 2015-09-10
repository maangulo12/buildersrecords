# -*- coding: utf-8 -*-

"""
    app.mail
    ~~~~~~~~~~~~~~

    Application mail module
"""

from flask import make_response, render_template, request, jsonify
from flask_mail import Message

from app import app, mail_service


@app.route('/email_registration', methods = ['POST'])
def email_registration():
    # email      = request.data.email
    # first_name = request.data.first_name
    # last_name  = request.data.last_name
    # username   = request.data.username
    print('MADE IT')
    msg = Message("Thank you from BuildersRecords", recipients = ['maangulo12@gmail.com'])
    msg.html = render_template('email/registration.html',
        username   = 'maangulo12',
        first_name = 'Miguel',
        last_name  = 'Angulo'
    )
    print('MADE IT2')
    # mail_service.send(msg)
    print('MADE IT3')
    return make_response(jsonify({'msg': 'Email sent!'}), 201)
