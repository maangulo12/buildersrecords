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
from uuid import uuid4
from werkzeug import secure_filename
from flask import make_response, request
from boto.s3.connection import S3Connection
from boto.s3.key import Key

from app import app, db
from app.models import Project, Category, Item
from app.settings import UPLOAD_PATH, AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET
from app.utility import parse_ubuildit_file


API_ENTRY = '/api/upload'


def save_file(path, file_obj, aws_flag=False):
    """
    Saves a file to the specified path.
        :param path: the path to store the file including the filename and
                     file extension
        :param file_obj: the file as a FileStorage object
        :param aws_flag: whether to store on AWS S3
        :return: True if the file is uploaded or saved
    """
    try:
        if (aws_flag):
            conn      = S3Connection(AWS_ACCESS_KEY, AWS_SECRET_KEY)
            bucket    = conn.get_bucket(S3_BUCKET)
            k         = Key(bucket=bucket, name=path)
            file_data = file_obj.read()
            k.set_contents_from_string(file_data)
        else:
            file_obj.save(path)

        return True

    except:
        print('Could not upload file', sys.exc_info()[0])
        return False


# add route protection
@app.route(API_ENTRY + '/ubuildit', methods=['POST'])
def ubuildit():
    """
    This route is used for uploading a UBuildIt Cost Review excel file.
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

    aws_criterion = [AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET]
    unique_id     = uuid4()
    full_path     = UPLOAD_PATH + '/' + user_id + '/' + name + '/' + str(unique_id)

    if save_file(full_path, file_obj, all(aws_criterion)):
        try:
            category_list = parse_ubuildit_file(full_path, all(aws_criterion))

            project = Project(name=name, address=address, city=city,
                              state=state, zipcode=zipcode, home_sq=home_sq,
                              project_type=project_type, user_id=user_id)
            db.session.add(project)
            db.session.commit()

            for cat in category_list:
                category = Category(name=cat['category_name'],
                                    project_id=project.id)
                db.session.add(category)
                db.session.commit()

                for cat_item in cat['item_list']:
                    item = Item(name=cat_item['cost_category'],
                                description=cat_item['description'],
                                estimated=cat_item['estimated'],
                                actual=cat_item['actual'],
                                category_id=category.id,
                                project_id=project.id)
                    db.session.add(item)
                    db.session.commit()

            return make_response('File was successfully uploaded', 201)

        except:
            return make_response('Excel file could not be read', 400)
    else:
        return make_response('Failed to upload file', 400)
