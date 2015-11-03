#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.uploads
    ~~~~~~~~~~~~~~

    This module is used for uploading files.

    Current APIs:
        -ubuildit : /api/upload/ubuildit
"""

import os
import sys
from werkzeug import secure_filename
from flask import make_response, request

from app import app, db
from app.models import Project, Category, Item
from app.settings import UPLOAD_PATH
from app.utility import parse_ubuildit_file


API_ENTRY = '/api/upload'


def upload_file(path, filename, file_obj):
    """
    Saves a file to the specified path.
    :param path: the path to store the file
    :param filename: the name of the file including the file extension
    :param file_obj: the file as a FileStorage object
    :return: True if the file is saved
    """
    try:
        secured_file = secure_filename(filename)
        full_path = os.path.join(path, secured_file)
        file_obj.save(full_path)
        return True

    except:
        print('Unexpected error:', sys.exc_info()[0])
        return False


# add route protection
@app.route(API_ENTRY + '/ubuildit', methods=['POST'])
def ubuildit():
    """
    This route is used for uploading a UBuildIt Cost Review excel file.
    """
    # get length of request
    file_obj = request.files['file']
    name = request.form['name']
    address = request.form['address']
    city = request.form['city']
    state = request.form['state']
    zipcode = request.form['zipcode']
    project_type = request.form['project_type']
    user_id = request.form['user_id']
    criterion = [file_obj, name, address, city,
                 state, zipcode, project_type, user_id]

    if not all(criterion):
        return make_response('Bad request', 400)

    # create unique file_name
    if upload_file(UPLOAD_PATH, file_obj.name, file_obj):
        try:
            secured_file = secure_filename(file_obj.name)
            full_path = ''.join([UPLOAD_PATH, secured_file])

            category_list = parse_ubuildit_file(full_path)

            # validation for field sizes

            project = Project(name=name, address=address, city=city, state=state,
                              zipcode=zipcode, project_type=project_type, user_id=user_id)
            db.session.add(project)
            db.session.commit()

            for cat in category_list:
                category = Category(
                    name=cat['category_name'], project_id=project.id)
                db.session.add(category)
                db.session.commit()

                for cat_item in cat['item_list']:
                    item = Item(name=cat_item['cost_category'], description=cat_item['description'],
                                budget=cat_item['budget'], actual=cat_item['actual'],
                                notes=cat_item['explanations'], category_id=category.id,
                                project_id=project.id)
                    db.session.add(item)
                    db.session.commit()

            return make_response('File was successfully uploaded', 201)

        except:
            return make_response('Excel file could not be read', 400)
    else:
        return make_response('Failed to upload file', 400)
