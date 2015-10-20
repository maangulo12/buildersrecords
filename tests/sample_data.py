#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    sample_data.py
    ---------------

    This module is used for adding sample data to the database.

    -How to use it (type the following in the command-line):
        python3 manage.py populate
"""

import random
import simplejson as json
from .parser import parse_ubuildit_file, parse_invoice_file


FILE_PATH = 'tests/data/spreadsheet.xlsx'

def populate_db(app):
    # Client test
    app.testing = True
    client = app.test_client()

    # Create User
    client.post('/api/users', data=json.dumps({
        'username': 'test',
        'password': 'test',
        'first_name': 'test',
        'last_name': 'test',
        'email': 'test@gmail.com'
    }),
        headers={
        'Content-Type': 'application/json'
    })

    # Authenticate User
    response = client.post('/auth', data=json.dumps({
        'login': 'test',
        'password': 'test'
    }),
        headers={
        'Content-Type': 'application/json'
    })

    # Auth Token
    data = json.loads(response.data.decode('utf-8'))
    token = data['token']

    # Create Project
    client.post('/api/projects', data=json.dumps({
        'name': 'UBuildIt - Tim & Maritza Messer',
        'user_id':  1
    }),
        headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    })

    # Start parsing UBUILDIT file here
    data = parse_ubuildit_file(FILE_PATH)

    for category in data:
        # Add Category
        client.post('/api/categories', data=json.dumps({
            'name': category['category_name'],
            'project_id': 1
        }),
            headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })

        for item in category['item_list']:
            # Add Item
            client.post('/api/items', data=json.dumps({
                'name': item['cost_category'],
                'description': item['description'],
                'amount': item['budget'],
                'notes': item['explanations'],
                'category_id': data.index(category) + 1,
                'project_id': 1
            }),
                headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            })

    # Add Funds/Loans
    client.post('/api/funds', data=json.dumps({
        'name': 'Messer',
        'loan': False,
        'amount': 30000.00,
        'project_id': 1
    }, use_decimal=True),
        headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    })
    client.post('/api/funds', data=json.dumps({
        'name': 'Blanco Loan',
        'loan': True,
        'amount': 330000.00,
        'project_id': 1
    }, use_decimal=True),
        headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    })

    # Add Draws
    client.post('/api/draws', data=json.dumps({
        'date': '09/24/2015',
        'amount': 25000.00,
        'fund_id': 2
    }, use_decimal=True),
        headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    })
    client.post('/api/draws', data=json.dumps({
        'date': '10/01/2015',
        'amount': 5000.00,
        'fund_id': 2
    }, use_decimal=True),
        headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    })
    client.post('/api/draws', data=json.dumps({
        'date': '10/03/2015',
        'amount': 7500.00,
        'fund_id': 2
    }, use_decimal=True),
        headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    })

    # Start parsing INVOICE file here
    data = parse_invoice_file(FILE_PATH)
    for expenditure in data:
        fund_id = 1
        if expenditure['notes'] == 'Blanco':
            fund_id = 2

        client.post('/api/expenditures', data=json.dumps({
            'date': expenditure['date'],
            'vendor': expenditure['vendor'],
            'notes': expenditure['description'],
            'cost': expenditure['cost'],
            'category_id': random.randint(1, 8),
            'item_id': random.randint(1, 110),
            'fund_id': fund_id,
            'project_id': 1
        }, use_decimal=True),
            headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })
