# -*- coding: utf-8 -*-

"""
    app.views
    ~~~~~~~~~~~~~~~~~~

    Application views module
"""

from flask import make_response

from app import app

@app.route('/', defaults = {'path': ''})
@app.route('/<path>')
def index(path):
    return make_response(open('app/templates/index.html').read())

# NEED TO ADD ERROR VIEWS
