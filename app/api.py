# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~
    API module
"""

from app import api_manager
from app.models import User, Project, Category, Item


api_manager.create_api(User, methods = ['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Project, methods = ['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Category, methods = ['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Item, methods = ['GET', 'POST', 'DELETE', 'PUT'])
