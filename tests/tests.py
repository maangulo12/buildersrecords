#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    tests.py
    ---------------

    This module is used for testing the backend of this application.

    -How to use it (type the following in the command-line):
        python3 manage.py runtests
"""

import json
import unittest
from flask import current_app

from app import app, db


class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_app_exists(self):
        self.assertFalse(current_app is None)

    def test_404(self):
        response = self.client.get('/wrong_url/bad')
        self.assertFalse(response.status_code is 404)

    def test_home_page(self):
        response = self.client.get('/')
        self.assertTrue(response.status_code is 200)

    def test_api(self):
        # GET /api/users (list)
        response = self.client.get('/api/users')
        self.assertTrue(response.status_code is 200)

        # POST /api/users (new user)
        response = self.client.post('/api/users', data=json.dumps({
            'username':   'user',
            'password':   'password',
            'first_name': 'first',
            'last_name':  'last',
            'email':      'email@gmail.com'
        }), headers={'content-type': 'application/json'})
        self.assertTrue(response.status_code is 201)

        # login for authentication header

        # GET /api/users/<int: id> (id = 1)
        response = self.client.get('/api/users/1')
        self.assertTrue(response.status_code is 200)

        # PUT /api/users/<int: id> (id = 1)
        response = self.client.put('/api/users/1', data=json.dumps({
            'username':   'user1',
            'password':   'password1',
            'first_name': 'first1',
            'last_name':  'last1',
            'email':      'email1@gmail.com'
        }), headers={'content-type': 'application/json'})
        self.assertTrue(response.status_code is 200)

        # DELETE /api/users/<int: id> (id = 1)
        response = self.client.delete('/api/users/1')
        self.assertTrue(response.status_code is 204)


if __name__ == '__main__':
    unittest.main()
