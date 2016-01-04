#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    admin
    ~~~~~~~~~~~

    This module implements the admin feature of this application.
"""

from flask_admin.contrib.sqla import ModelView

from app import admin, db
from app.models import User, Project, Category, Item, Expenditure, Fund, Draw, Subcontractor


admin.add_view(ModelView(User, db.session))
