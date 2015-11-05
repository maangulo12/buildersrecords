#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.views
    ~~~~~~~~~~~~~~~~~~

    This module implements all of the views/routes of this application.
"""

from flask import make_response

from app import app


@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def index(path):
    return make_response(open('app/templates/index.html').read())


@app.errorhandler(404)
def page_not_found(e):
    return make_response(open('app/templates/error/404_error.html').read())
