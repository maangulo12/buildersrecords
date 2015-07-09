# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~

    API module
"""

from app.core import api_manager
from app.models import User


api_manager.create_api(User, methods=['GET', 'POST', 'DELETE', 'PUT'])
