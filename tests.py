# -*- coding: utf-8 -*-

"""
    tests.py
    ---------------

    Module for testing web API
"""

import unittest

from app.core import app, db


class AppTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        print('Set Up')
        db.create_all()

    def tearDown(self):
        db.session.remove()
        print('Tear Down')
        db.drop_all()

    def test_empty_db(self):
        rv = self.app.get('/')
        assert 'No entries here so far' in rv.data


if __name__ == '__main__':
    unittest.main()
