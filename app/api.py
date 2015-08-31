# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~

    API module
"""

from flask import request, jsonify

from app import app
from app.models import User


@app.route('/api/users', methods=['GET', 'POST', 'PUT', 'DELETE'])
def users():
    if request.method == 'GET':
        return jsonify({'hello': 'helloworld'})

    if request.method == 'POST':
        return jsonify({'hello': 'helloworld'})

    if request.method == 'PUT':
        return jsonify({'hello': 'helloworld'})

    if request.method == 'DELETE':
        return jsonify({'hello': 'helloworld'})
