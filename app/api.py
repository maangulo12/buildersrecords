# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~

    This is the API module for the Flask-Restless extension.

    Current APIs:
        -Users        : /api/users
        -Projects     : /api/projects
        -Categories   : /api/categories
        -Items        : /api/items
        -Expenditures : /api/expenditures

    *Note: auth_func is imported in this module in order to protect API.
"""

from app import api_manager
from app.jwt import auth_func
from app.models import User, Project, Category, Item, Expenditure


# Users: /api/users
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# GET_MANY and POST are unprotected (not listed in preprocessors)
api_manager.create_api(User,
    methods          = ['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix       = '/api',
    results_per_page = 0,
    preprocessors    = dict(GET_SINGLE    = [auth_func],
                            PUT_SINGLE    = [auth_func],
                            PUT_MANY      = [auth_func],
                            DELETE_SINGLE = [auth_func],
                            DELETE_MANY   = [auth_func]),
    collection_name  = 'users')

# Projects: /api/projects
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Project,
    methods          = ['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix       = '/api',
    results_per_page = 0,
    preprocessors    = dict(POST          = [auth_func],
                            GET_SINGLE    = [auth_func],
                            GET_MANY      = [auth_func],
                            PUT_SINGLE    = [auth_func],
                            PUT_MANY      = [auth_func],
                            DELETE_SINGLE = [auth_func],
                            DELETE_MANY   = [auth_func]),
    collection_name  = 'projects')

# Categories: /api/categories
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Category,
    methods          = ['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix       = '/api',
    results_per_page = 0,
    preprocessors    = dict(POST          = [auth_func],
                            GET_SINGLE    = [auth_func],
                            GET_MANY      = [auth_func],
                            PUT_SINGLE    = [auth_func],
                            PUT_MANY      = [auth_func],
                            DELETE_SINGLE = [auth_func],
                            DELETE_MANY   = [auth_func]),
    collection_name  = 'categories')

# Items: /api/items
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Item,
    methods          = ['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix       = '/api',
    results_per_page = 0,
    preprocessors    = dict(POST          = [auth_func],
                            GET_SINGLE    = [auth_func],
                            GET_MANY      = [auth_func],
                            PUT_SINGLE    = [auth_func],
                            PUT_MANY      = [auth_func],
                            DELETE_SINGLE = [auth_func],
                            DELETE_MANY   = [auth_func]),
    collection_name  = 'items')

# Expenditures: /api/expenditures
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Expenditure,
    methods          = ['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix       = '/api',
    results_per_page = 0,
    preprocessors    = dict(POST          = [auth_func],
                            GET_SINGLE    = [auth_func],
                            GET_MANY      = [auth_func],
                            PUT_SINGLE    = [auth_func],
                            PUT_MANY      = [auth_func],
                            DELETE_SINGLE = [auth_func],
                            DELETE_MANY   = [auth_func]),
    collection_name  = 'expenditures')
