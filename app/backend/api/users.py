# -*- coding: utf-8 -*-

"""
    app.backend.api.users
    ~~~~~~~~~~~~~

    Users endpoints
"""

from flask import Blueprint, jsonify


users = Blueprint('users', __name__, url_prefix = '/users')


@users.route('/', methods = ['GET'])
def list():
    return jsonify({'list': 'Getting list...'})


@users.route('/', methods = ['POST'])
def new():
    return jsonify({'new': 'Creating new user...'})


@users.route('/<int:user_id>', methods = ['GET'])
def show(user_id):
    return jsonify({'show': 'Showing user... %s' % (user_id,)})


@users.route('/<int:user_id>', methods = ['PUT'])
def update(user_id):
    return jsonify({'update': 'Updating user... %s' % (user_id,)})


@users.route('/<int:user_id>', methods = ['DELETE'])
def delete(user_id):
    return jsonify({'delete': 'Deleting user... %s' % (user_id,)})
