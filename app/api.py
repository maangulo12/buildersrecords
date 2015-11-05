#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api
    ~~~~~~~~~~~~~~~~

    This is the API module for the Flask-Restless extension.

    Current APIs:
        -Users          : /api/users
        -Projects       : /api/projects
        -Categories     : /api/categories
        -Items          : /api/items
        -Expenditures   : /api/expenditures
        -Funds          : /api/funds
        -Draws          : /api/draws
        -Subcontractors : /api/subcontractors

    *Note: verify_jwt is imported in this module for security.
"""

from app import api_manager
from app.jwt import verify_jwt
from app.models import User, Project, Category, Item, Expenditure, Fund, Draw, Subcontractor


# Users: /api/users
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# GET_MANY and POST are unprotected (not listed in preprocessors)
api_manager.create_api(User,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = '/api',
                       collection_name  = 'users',
                       results_per_page = 0,
                       preprocessors    = dict(
                                          GET_SINGLE    = [verify_jwt],
                                          PUT_SINGLE    = [verify_jwt],
                                          PUT_MANY      = [verify_jwt],
                                          DELETE_SINGLE = [verify_jwt],
                                          DELETE_MANY   = [verify_jwt]))

# Projects: /api/projects
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Project,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = '/api',
                       collection_name  = 'projects',
                       results_per_page = 0,
                       preprocessors    = dict(
                                          POST          = [verify_jwt],
                                          GET_SINGLE    = [verify_jwt],
                                          GET_MANY      = [verify_jwt],
                                          PUT_SINGLE    = [verify_jwt],
                                          PUT_MANY      = [verify_jwt],
                                          DELETE_SINGLE = [verify_jwt],
                                          DELETE_MANY   = [verify_jwt]))

# Categories: /api/categories
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Category,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = '/api',
                       collection_name  = 'categories',
                       results_per_page = 0,
                       preprocessors    = dict(
                                          POST          = [verify_jwt],
                                          GET_SINGLE    = [verify_jwt],
                                          GET_MANY      = [verify_jwt],
                                          PUT_SINGLE    = [verify_jwt],
                                          PUT_MANY      = [verify_jwt],
                                          DELETE_SINGLE = [verify_jwt],
                                          DELETE_MANY   = [verify_jwt]))

# Items: /api/items
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Item,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = '/api',
                       collection_name  = 'items',
                       results_per_page = 0,
                       preprocessors    = dict(
                                          POST          = [verify_jwt],
                                          GET_SINGLE    = [verify_jwt],
                                          GET_MANY      = [verify_jwt],
                                          PUT_SINGLE    = [verify_jwt],
                                          PUT_MANY      = [verify_jwt],
                                          DELETE_SINGLE = [verify_jwt],
                                          DELETE_MANY   = [verify_jwt]))

# Expenditures: /api/expenditures
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Expenditure,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = '/api',
                       collection_name  = 'expenditures',
                       results_per_page = 0,
                       preprocessors    = dict(
                                          POST          = [verify_jwt],
                                          GET_SINGLE    = [verify_jwt],
                                          GET_MANY      = [verify_jwt],
                                          PUT_SINGLE    = [verify_jwt],
                                          PUT_MANY      = [verify_jwt],
                                          DELETE_SINGLE = [verify_jwt],
                                          DELETE_MANY   = [verify_jwt]))

# Funds: /api/funds
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Fund,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = '/api',
                       collection_name  = 'funds',
                       results_per_page = 0,
                       preprocessors    = dict(
                                          POST          = [verify_jwt],
                                          GET_SINGLE    = [verify_jwt],
                                          GET_MANY      = [verify_jwt],
                                          PUT_SINGLE    = [verify_jwt],
                                          PUT_MANY      = [verify_jwt],
                                          DELETE_SINGLE = [verify_jwt],
                                          DELETE_MANY   = [verify_jwt]))

# Draws: /api/draws
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# allow_delete_many: to allow bulk deletions
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Draw,
                       methods           = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix        = '/api',
                       collection_name   = 'draws',
                       results_per_page  = 0,
                       allow_delete_many = True,
                       preprocessors     = dict(
                                           POST          = [verify_jwt],
                                           GET_SINGLE    = [verify_jwt],
                                           GET_MANY      = [verify_jwt],
                                           PUT_SINGLE    = [verify_jwt],
                                           PUT_MANY      = [verify_jwt],
                                           DELETE_SINGLE = [verify_jwt],
                                           DELETE_MANY   = [verify_jwt]))


# Subcontractors: /api/subcontractors
# methods allowed: GET, POST, DELETE, PUT
# results_per_page: pagination turned off (set to 0)
# allow_delete_many: to allow bulk deletions
# All methods are protected (all of them are listed in preprocessors)
api_manager.create_api(Subcontractor,
                       methods           = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix        = '/api',
                       collection_name   = 'subcontractors',
                       results_per_page  = 0,
                       allow_delete_many = True,
                       preprocessors     = dict(
                                           POST          = [verify_jwt],
                                           GET_SINGLE    = [verify_jwt],
                                           GET_MANY      = [verify_jwt],
                                           PUT_SINGLE    = [verify_jwt],
                                           PUT_MANY      = [verify_jwt],
                                           DELETE_SINGLE = [verify_jwt],
                                           DELETE_MANY   = [verify_jwt]))
