# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~

    API module
"""

from flask import request, jsonify, g

from app import app
from app.auth import auth
from app.models import User


@app.route('/api/users', methods=['GET', 'POST', 'PUT', 'DELETE'])
def users():
    if request.method == 'GET':
        list_obj = []
        data = {
            'num_results': len(list_obj),
            'objects': list_obj
        }
        for user in User.query.all():
            data = {
                'num_results': len(user),
                'objects': list_obj.append(user.as_dict())
            }
        return jsonify(data)

    if request.method == 'POST':
        user = User(request.args.get('username'),
                    request.args.get('password'),
                    request.args.get('first_name'),
                    request.args.get('last_name'),
                    request.args.get('email'))
        db.session.add(me)
        db.session.commit()
        return jsonify({'msg': 'ADDED'})

    if request.method == 'PUT':
        return jsonify({'hello': 'helloworld'})

    if request.method == 'DELETE':
        return jsonify({'hello': 'helloworld'})

@app.route('/api/resource')
@auth.login_required
def get_resource():
    return jsonify({ 'data': 'Hello, %s!' % g.admin.username })
