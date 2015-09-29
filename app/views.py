# -*- coding: utf-8 -*-

"""
    app.views
    ~~~~~~~~~~~~~~~~~~

    This module implements all of the routes / views of this application.
"""

from flask import make_response

from app import app


# This is the index view (first view loaded)
@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def index(path):
    return make_response(open('app/templates/index.html').read())


# This is an error 404 view (when 404 error occurs this page loads)
@app.errorhandler(404)
def page_not_found(e):
    return make_response(open('app/templates/error/404_error.html').read())
