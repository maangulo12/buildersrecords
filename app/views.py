# -*- coding: utf-8 -*-

"""
    app.views
    ~~~~~~~~~~~~~~~~~~

    Application views module
"""

from flask import make_response

from app import app

# NEED TO FIX THIS: Catch all url routes in Flask (not catching all routes at the moment)
@app.route('/', defaults = { 'path': '' })
@app.route('/<path:path>')
def index(path):
    return make_response(open('app/templates/index.html').read())
