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
    client.post('/api/users', data = json.dumps({
        'username'  : 'test',
        'password'  : 'test',
        'first_name': 'test',
        'last_name' : 'test',
        'email'     : 'test@gmail.com'
    }), headers = {
        'Content-Type': 'application/json'
    })

    # Authenticate User
    response = client.post('/auth', data = json.dumps({
        'username': 'test',
        'password': 'test'
    }), headers = {
        'Content-Type': 'application/json'
    })

    # Auth Token
    data  = json.loads(response.data.decode('utf-8'))
    token = data['token']

    # Create Project
    client.post('/api/projects', data = json.dumps({
        'project_name': 'Test Project',
        'user_id'     :  1
    }), headers = {
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + token
    })
