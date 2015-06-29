# -*- coding: utf-8 -*-

"""
    app.views
    ~~~~~~~~~~~

    Views module
"""

from flask import *

from app.core import app


@app.route('/')
def home():
    return render_template('home.html')
