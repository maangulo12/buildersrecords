#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.api.subscriptions
    ~~~~~~~~~~~~~~~~~~~~~

    This API is used for subscriptions.
"""

import stripe
from flask import request, make_response, jsonify

from app import app, db
from app.models import User


URL = '/api/subscriptions'


@app.route(URL, methods=['POST'])
def post_subscription():
    """
    Creates a subscription for the user.

    Request Example:
    POST
    {
        email    : 'email address'
        username : 'username'
        password : 'password'
        plan     : 'subscription plan'
        token_id : 'stripe card token id'
    }
    """
    data      = request.get_json(force=True)
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
        print('ERROR: Card declined')
        return make_response('Card declined', 400)

    except stripe.error.RateLimitError:
        print('ERROR: Too many requests made to Stripe')
        return make_response('Too many requests made to Stripe', 400)

    except stripe.error.InvalidRequestError:
        print('ERROR: Invalid parameters were supplied to Stripe')
        return make_response('Invalid parameters were supplied to Stripe', 400)

    except stripe.error.AuthenticationError:
        print('ERROR: Authentication with Stripe failed')
        return make_response('Authentication with Stripe failed', 400)

    except stripe.error.APIConnectionError:
        print('ERROR: Network communication with Stripe failed')
        return make_response('Network communication with Stripe failed', 400)

    except stripe.error.StripeError:
        print('ERROR: Stripe Error')
        return make_response('Stripe Error', 400)

    except Exception:
        print('ERROR: Error')
        return make_response('Error', 400)


# Needs route security
@app.route(URL + '/<stripe_id>', methods=['GET'])
def get_subscription(stripe_id):
    """
    Get user data from Stripe.
    """
    customer = stripe.Customer.retrieve(stripe_id)

    if customer is None:
        return make_response('Could not retrieve customer', 400)

    return make_response(jsonify(customer), 200)


# Needs route security
@app.route(URL + '/<stripe_id>', methods=['PUT'])
def put_subscription(stripe_id):
    """
    Update user billing information in Stripe.

    Request Example:
    PUT
    {
        stripe_id : 'stripe customer id'
        token_id  : 'stripe card token id'
    }
    """
    data      = request.get_json(force=True)
    stripe_id = data.get('stripe_id', None)
    token_id  = data.get('token_id', None)
    criterion = [stripe_id, token_id, len(data) == 2]

    if not all(criterion):
        print('ERROR 404: Bad request')
        return make_response('Bad request', 400)

    try:
        customer = stripe.Customer.retrieve(stripe_id)

        if customer is None:
            return make_response('Could not retrieve customer', 400)

        customer.source = token_id
        customer.save()
        return make_response(jsonify(customer), 200)

    except stripe.error.CardError:
        print('ERROR: Card declined')
        return make_response('Card declined', 400)

    except stripe.error.RateLimitError:
        print('ERROR: Too many requests made to Stripe')
        return make_response('Too many requests made to Stripe', 400)

    except stripe.error.InvalidRequestError:
        print('ERROR: Invalid parameters were supplied to Stripe')
        return make_response('Invalid parameters were supplied to Stripe', 400)

    except stripe.error.AuthenticationError:
        print('ERROR: Authentication with Stripe failed')
        return make_response('Authentication with Stripe failed', 400)

    except stripe.error.APIConnectionError:
        print('ERROR: Network communication with Stripe failed')
        return make_response('Network communication with Stripe failed', 400)

    except stripe.error.StripeError:
        print('ERROR: Stripe Error')
        return make_response('Stripe Error', 400)

    except Exception:
        print('ERROR 404: Error')
        return make_response('Error', 400)
