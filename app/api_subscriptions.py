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
    Creates a customer and a subscription for the customer.

    POST: {
        email:
        card:

    }
    """
    # Get JSON data
    data       = request.get_json(force=True)
    email      = data.get('email', None)
    card       = data.get('card', None)
    expiration = data.get('expiration', None)
    cvc        = data.get('cvc', None)
    criterion  = [email, username, len(data) == 4]

    if not all(criterion):
        return make_response('Bad Request', 400)

    # API Key
    stripe.api_key = current_app.config['STRIPE_API_KEY']
    # Amount in cents
    amount = 25000
    # Create customer
    customer = stripe.Customer.create(
        email='customer@example.com',
        plan='monthly',
        source=''
    )
    # Store customer id
    return make_response('Customer successfully subscribed!', 201)
