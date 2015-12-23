#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_subscriptions
    ~~~~~~~~~~~~~~~~~~~~~

    This module is used for subscriptions.
"""

import stripe
from flask import request, make_response, jsonify

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
        plan     : 'subscription plan'
        token_id : 'stripe token id'
    }
    """
    data = request.get_json(force=True)
    email     = data.get('email', None)
    username  = data.get('username', None)
    password  = data.get('password', None)
    plan      = data.get('plan', None)
    token_id  = data.get('token_id', None)
    criterion = [email,
                username,
                password,
                plan,
                token_id,
                len(data) == 5,
                len(email) <= 50,
                4 <= len(username) <= 30]

    if not all(criterion):
        print('ERROR 404: Bad request')
        return make_response('Bad request', 400)

    try:
        customer = stripe.Customer.create(
            email=email,
            plan=plan,
            source=token_id
        )
        user = User(
            email=email,
            username=username,
            password=password,
            stripe_id=customer['id']
        )
        db.session.add(user)
        db.session.commit()
        return make_response('Customer succesfully subscribed', 201)

    except stripe.error.CardError:
        print('ERROR 404: Card declined')
        return make_response('Card declined', 400)

    except stripe.error.RateLimitError:
        print('ERROR 404: Too many requests made to Stripe')
        return make_response('Too many requests made to Stripe', 400)

    except stripe.error.InvalidRequestError:
        print('ERROR 404: Invalid parameters were supplied to Stripe')
        return make_response('Invalid parameters were supplied to Stripe', 400)

    except stripe.error.AuthenticationError:
        print('ERROR 404: Authentication with Stripe failed')
        return make_response('Authentication with Stripe failed', 400)

    except stripe.error.APIConnectionError:
        print('ERROR 404: Network communication with Stripe failed')
        return make_response('Network communication with Stripe failed', 400)

    except stripe.error.StripeError:
        print('ERROR 404: Stripe Error')
        return make_response('Stripe Error', 400)

    except Exception:
        print('ERROR 404: Error')
        return make_response('Error', 400)


# Needs route security
@app.route(API_ENTRY + '/<stripe_id>', methods=['GET'])
def get_customer(stripe_id):
    """
    Get customer data from Stripe.
    """
    customer = stripe.Customer.retrieve(stripe_id)

    if customer is None:
        return make_response('Could not retrieve customer', 400)

    return make_response(jsonify(customer), 200)


# Needs route security
@app.route(API_ENTRY + '/<stripe_id>', methods=['PUT'])
def update_customer(stripe_id):
    """
    Update customer data in Stripe.
    """
    if customer is None:
        return make_response('Could not retrieve customer', 400)

    return make_response(jsonify(customer), 200)
