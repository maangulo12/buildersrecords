#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.api_uploads
    ~~~~~~~~~~~~~~~

    This module is used for uploading files.

    Current APIs:
        -ubuildit : /api/upload/ubuildit (POST)
"""

from uuid import uuid4
from flask import make_response, request, current_app
from boto.s3.connection import S3Connection
from boto.s3.key import Key

from app import app, db
from app.models import Project, Category, Item
from app.utility import parse_ubuildit_file


API_ENTRY = '/api/uploads'


def upload_file(key, file_obj):
    """
    Uploads a file to AWS S3.
        :param key: AWS bucket key
        :param file_obj: the file as a FileStorage object
        :return: True if the file is uploaded
    """
    try:
        data = file_obj.read()
        key.set_contents_from_string(data)
        return True

    except:
        return False


def get_bucket_key(path):
    """
    Gets the AWS Bucket Key.
        :param path: the path to store the file
        :return: AWS bucket key
    """
    conn   = S3Connection(current_app.config['AWS_ACCESS_KEY'], current_app.config['AWS_SECRET_KEY'])
    bucket = conn.get_bucket(current_app.config['S3_BUCKET'])
    key    = Key(bucket=bucket, name=path)
    return key


# Needs route security
@app.route(API_ENTRY + '/ubuildit', methods=['POST'])
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

    path = current_app.config['UPLOAD_PATH'] + '/' + user_id + '/' + name + '/' + str(uuid4())
    key  = get_bucket_key(path)
    data = file_obj.read()

    if key is None:
        return make_response('Could not get AWS bucket key', 400)

    if upload_file(key, file_obj):
        try:
            category_list = parse_ubuildit_file(data)

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

            return make_response('Success! The file was uploaded', 201)

        except:
            return make_response('The file could not be read', 400)
    else:
        return make_response('Could not upload file', 400)
