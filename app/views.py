#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.views
    ~~~~~~~~~~~~~~~~~~

    This module implements all of the views/routes of this application.
"""

from flask import make_response, render_template

from app import app


@app.route('/', defaults={'url': ''})
@app.route('/<path:url>')
def catch_all(url):
    return render_template('index.html')


@app.errorhandler(404)
def page_not_found(e):
    return make_response(open('app/templates/error/404_error.html').read())
