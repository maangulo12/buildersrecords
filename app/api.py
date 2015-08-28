# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~
    API module
"""

from flask_restful import Resource

from app import api_manager
from app.models import User, Project, Category, Item


class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api_manager.add_resource(HelloWorld, '/api/helloworld')
