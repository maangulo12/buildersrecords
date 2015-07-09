# -*- coding: utf-8 -*-

"""
    app.backed.views
    ~~~~~~~~~~~~~~~~

    Views module
"""

from flask import *

from app.backend.core import app


@app.route('/')
def home():
    return render_template('home.html')
