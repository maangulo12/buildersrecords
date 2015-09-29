#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    sample_data.py
    ---------------

    This module is used for adding sample data to the database.

    -How to use it (type the following in the command-line):
        python3 manage.py populate
"""

import json


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
    }), headers={
        'Content-Type': 'application/json'
    })

    # Authenticate User
    response = client.post('/auth', data=json.dumps({
        'login': 'test',
        'password': 'test'
    }), headers={
        'Content-Type': 'application/json'
    })

    # Auth Token
    data = json.loads(response.data.decode('utf-8'))
    token = data['token']

    # Create Project
    client.post('/api/projects', data=json.dumps({
        'project_name': 'Test Project',
        'user_id':  1
    }), headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    })

    # Add Categories
    category_list = [
        'Pre-Construction',
        'Foundation',
        'Interior Finishing',
        'General Trades'
    ]
    for category in category_list:
        client.post('/api/categories', data=json.dumps({
            'category_name': category,
            'project_id': 1
        }), headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })

        # Add Items
        item_list = [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4'
        ]
        for item in item_list:
            client.post('/api/items', data=json.dumps({
                'item_name': item,
                'description': 'Description',
                'notes': 'Notes',
                'category_id': category_list.index(category) + 1
            }), headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            })

    # Add Expenditures
    expenditure_list = [
        'Expenditure 1',
        'Expenditure 2',
        'Expenditure 3',
        'Expenditure 4',
        'Expenditure 5',
        'Expenditure 6',
        'Expenditure 7'
    ]
    for expenditure in expenditure_list:
        client.post('/api/expenditures', data=json.dumps({
            'date': '09/24/2015',
            'vendor': 'Vendor Name',
            'description': 'Description',
            'notes': 'Notes',
            'loan': True,
            'project_id': 1
        }), headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })
