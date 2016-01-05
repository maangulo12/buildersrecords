#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.api_uploads
    ~~~~~~~~~~~~~~~

    This module is used for uploading files.

    Current APIs:
        -ubuildit : /api/upload/ubuildit (POST)
"""

from flask import Blueprint, make_response, request

from app import app, db
from app.models import Project, Category, Item
from app.utility import parse_ubuildit_file


bp = Blueprint('uploads', __name__, url_prefix='/api')


# Needs route security
@bp.route('/uploads/ubuildit', methods=['POST'])
def ubuildit():
    """
    Uploads a UBuildIt Cost Review excel file to AWS S3.

    POST: {
        file         : 'file' (FileStorage object)
        name         : 'name'
        address      : 'address'
        city         : 'city'
        state        : 'state'
        zipcode      : 'zipcode'
        home_sq      : 'home_sq'
        project_type : 'project_type'
        user_id      : 'user_id'
    }
    """
    # get length of request
    file_obj     = request.files['file']
    name         = request.form['name']
    address      = request.form['address']
    city         = request.form['city']
    state        = request.form['state']
    zipcode      = request.form['zipcode']
    home_sq      = request.form['home_sq']
    project_type = request.form['project_type']
    user_id      = request.form['user_id']

    criterion = [file_obj, name, address, city,
                 state, zipcode, home_sq, project_type, user_id]

    if not all(criterion):
        return make_response('Bad request', 400)

    try:
        # Check for invalid file
        data = file_obj.read()
        category_list = parse_ubuildit_file(data)

        project = Project(
            name=name,
            address=address,
            city=city,
            state=state,
            zipcode=zipcode,
            home_sq=home_sq,
            project_type=project_type,
            user_id=user_id
        )
        db.session.add(project)
        db.session.commit()

        for cat in category_list:
            category = Category(
                name=cat['category_name'],
                project_id=project.id
            )
            db.session.add(category)
            db.session.commit()

            for cat_item in cat['item_list']:
                item = Item(
                    name=cat_item['cost_category'],
                    description=cat_item['description'],
                    estimated=cat_item['estimated'],
                    actual=cat_item['actual'],
                    category_id=category.id,
                    project_id=project.id
                )
                db.session.add(item)
                db.session.commit()

        return make_response('Success! The file was uploaded', 201)

    except:
        return make_response('The file could not be read', 400)


app.register_blueprint(bp)
