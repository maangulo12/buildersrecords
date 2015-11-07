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


if __name__ == '__main__':
    unittest.main()
