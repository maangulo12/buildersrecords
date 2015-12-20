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
        email    : 'email address'
        username : 'username'
        password : 'password'
        sub_plan : 'subscription plan'
        token_id : 'stripe token id'
    }
    """
    data = request.get_json(force=True)
    email     = data.get('email', None)
    username  = data.get('username', None)
    password  = data.get('password', None)
    sub_plan  = data.get('sub_plan', None)
    token_id  = data.get('token_id', None)
    criterion = [email, username, password, sub_plan, token_id, len(data) == 5]

    if not all(criterion):
        return make_response('Bad Request', 400)

    customer = stripe.Customer.create(
        email=email,
        plan=sub_plan,
        source=token_id
    )

    if customer is None:
        return make_response('Customer could not be subscribed', 400)

    user = User(
        email=email,
        username=username,
        password=password,
        stripe_id=customer['id']
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
    customer = stripe.Customer.retrieve(stripe_id)

    if customer is None:
        return make_response('Could not retrieve customer', 400)

    print(customer)

    return make_response(jsonify(customer), 200)
