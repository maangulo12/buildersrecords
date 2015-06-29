# -*- coding: utf-8 -*-

"""
    app.core
    ~~~~~~~~~~~

    Core module
"""

from flask import Flask

from app.settings import *


app = Flask(__name__)
app.config.update(
    SECRET_KEY = SECRET_KEY
)


from app import settings
from app import views
