#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_subscriptions
    ~~~~~~~~~~~

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

    }
    """
    stripe.api_key = current_app.config['STRIPE_API_KEY']
    # Get JSON data

    # Create Customer
    stripe.Customer.create(
        email="",
        description="Customer for test@example.com",
        source="tok_17EE2cD49oGyKMoCirkykocN" # obtained with Stripe.js
    )

    # Subscribe Customer
