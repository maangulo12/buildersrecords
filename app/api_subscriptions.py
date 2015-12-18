#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_subscriptions
    ~~~~~~~~~~~~~~~~~~~~~

    This module is used for subscriptions.
"""

import stripe
from flask import current_app, request, make_response, jsonify

from app import app, db
from app.models import User


API_ENTRY = '/api/subscriptions'


@app.route(API_ENTRY, methods=['POST'])
def subscribe_customer():
    """
    Creates a subscription for the customer.

    POST: {
        email       : 'email address'
        username    : 'username'
        password    : 'password'
        sub_plan    : 'subscription plan'
        card_name   : 'cardholder name'
        card_number : 'credit or debit card number'
        exp_month   : 'expiration month'
        exp_year    : 'expiration year'
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

    stripe.api_key = current_app.config['STRIPE_API_KEY']
    card = {
        'object':    'card',
        'number':    card_number,
        'exp_month': exp_month,
        'exp_year':  exp_year,
        'cvc':       cvc,
        'name':      card_name
    }
    customer = stripe.Customer.create(
        email=email,
        description=card_name,
        plan=sub_plan,
        source=card
    )

    if customer is None:
        return make_response('Customer could not be subscribed', 400)

    user = User(
        email=email,
        username=username,
        password=password,
        stripe_id=customer.id
    )
    db.session.add(user)
    db.session.commit()

    return make_response('Customer succesfully subscribed', 201)


# Needs route security
@app.route(API_ENTRY + '/<stripe_id>', methods=['GET'])
def get_customer(stripe_id):
    """
    Get customer data from stripe_id.
    """
    stripe.api_key = current_app.config['STRIPE_API_KEY']
    customer = stripe.Customer.retrieve(stripe_id)

    if customer is None:
        return make_response('Could not retrieve customer', 400)

    # NEEDS WORK - cannot return customer
    return make_response(jsonify(customer), 200)
