# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~

    API module
"""

from flask_restful import Resource, fields, marshal_with

from app import api_manager
from app.models import User


resource_fields = {
    'username':   fields.String,
    'password':   fields.String,
    'first_name': fields.String,
    'last_name':  fields.String,
    'email':      fields.String
}


class Users(Resource):
    @marshal_with(resource_fields)
    def get(self, **kwargs):
        list_obj = []
        data = {
            'num_results': len(list_obj),
            'objects': list_obj
        }
        for user in User.query.all():
            data = {
                'num_results': len(list_obj),
                'objects': list_obj.append(user.as_dict())
            }
        return data

api_manager.add_resource(Users, '/api/users')
