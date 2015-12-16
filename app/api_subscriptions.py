#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_subscriptions
    ~~~~~~~~~~~~~~~~~~~~~

    This module is used for subscriptions.
"""

import stripe
from flask import current_app

from app import app


API_ENTRY = '/api/subscriptions'


# Needs route security
@app.route(API_ENTRY, methods=['POST'])
def subscriptions():
    """
    Creates a subscription for the customer.

    POST: {
        email       : 'email address'
        username    : 'username'
        password    : 'password'
        sub_plan    : 'subscription plan'
        card_name   : 'cardholder name'
        card_number : 'credit or debit card number'
        exp_date    : 'expiration date'
        cvc         : 'cvc'
    }
    """
    data = request.get_json(force=True)
    email       = data.get('email', None)
    username    = data.get('username', None)
    password    = data.get('password', None)
    sub_plan    = data.get('sub_plan', None)
    card_name   = data.get('card_name', None)
    card_number = data.get('card_number', None)
    exp_month   = data.get('exp_month', None)
    exp_year    = data.get('exp_year', None)
    cvc         = data.get('cvc', None)
    criterion = [email, username, password, sub_plan, card_name, card_number,
                 exp_month, exp_year, cvc, len(data) == 9]

    if not all(criterion):
        return make_response('Bad Request', 400)

    # Enroll customer to a subscription with Stripe
    # API Key
    stripe.api_key = current_app.config['STRIPE_API_KEY']
    # Amount in cents
    amount = 25000
    # Create customer
    customer = stripe.Customer.create(
        email=email,
        plan='monthly',
        source=''
    )

    # Store email, username, password, sub_plan, card_name, card_number,
    #       exp_date, cvc, customer_id

    return make_response('Customer successfully subscribed!', 201)
