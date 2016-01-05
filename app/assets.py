#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    assets
    ~~~~~~~~~~~

    This module implements the frontend application asset pipeline.
"""

from flask.ext.assets import Bundle

from app import assets


css = Bundle('/css/main.scss', filters='scss', output='/css/main.min.css',
              debug=app.config['DEBUG'])

# assets.register(css)
