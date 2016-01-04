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
admin.add_view(ModelView(Project, db.session))
admin.add_view(ModelView(Category, db.session))
admin.add_view(ModelView(Item, db.session))
admin.add_view(ModelView(Expenditure, db.session))
admin.add_view(ModelView(Fund, db.session))
admin.add_view(ModelView(Draw, db.session))
admin.add_view(ModelView(Subcontractor, db.session))
