#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.views
    ~~~~~~~~~~~~~~~~~~

    This module implements all of the views/routes of this application.
"""

from flask import Blueprint, make_response, render_template


bp = Blueprint('views', __name__)


@bp.route('/', defaults={'url': ''})
@bp.route('/<path:url>')
def catch_all(url):
    return render_template('index.html')


@bp.errorhandler(404)
def page_not_found(e):
    return make_response(open('app/templates/error/404_error.html').read())
