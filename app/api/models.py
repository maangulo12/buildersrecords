#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.api.models
    ~~~~~~~~~~~~~~

    This module is used for accessing the models.

    Current APIs:
        -Users          : /api/users          (GET, POST, DELETE, PUT)
        -Projects       : /api/projects       (GET, POST, DELETE, PUT)
        -Categories     : /api/categories     (GET, POST, DELETE, PUT)
        -Items          : /api/items          (GET, POST, DELETE, PUT)
        -Expenditures   : /api/expenditures   (GET, POST, DELETE, PUT)
        -Funds          : /api/funds          (GET, POST, DELETE, PUT)
        -Draws          : /api/draws          (GET, POST, DELETE, PUT)
        -Subcontractors : /api/subcontractors (GET, POST, DELETE, PUT)
"""

from app import restless
from app.auth import verify_jwt
from app.models import User, Project, Category, Item, Expenditure, Fund, Draw, Subcontractor


URL = '/api'


# Users: /api/users
restless.create_api(User,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = URL,
                       collection_name  = 'users',
                       results_per_page = 0,
                       preprocessors    = dict(
                                          POST          = [verify_jwt],
                                          GET_SINGLE    = [verify_jwt],
                                          GET_MANY      = [verify_jwt],
                                          PUT_SINGLE    = [verify_jwt],
                                          PUT_MANY      = [verify_jwt],
                                          DELETE_SINGLE = [verify_jwt],
                                          DELETE_MANY   = [verify_jwt]))

# Projects: /api/projects
restless.create_api(Project,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = URL,
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
restless.create_api(Category,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = URL,
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
restless.create_api(Item,
                       methods           = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix        = URL,
                       collection_name   = 'items',
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

# Expenditures: /api/expenditures
restless.create_api(Expenditure,
                       methods           = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix        = URL,
                       collection_name   = 'expenditures',
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

# Funds: /api/funds
restless.create_api(Fund,
                       methods          = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix       = URL,
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
restless.create_api(Draw,
                       methods           = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix        = URL,
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
restless.create_api(Subcontractor,
                       methods           = ['GET', 'POST', 'DELETE', 'PUT'],
                       url_prefix        = URL,
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
