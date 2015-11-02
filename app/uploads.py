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
from xlrd import open_workbook
from werkzeug import secure_filename
from flask import make_response, request

from app import app
from app.settings import UPLOAD_PATH


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
        location = os.path.join(path, secured_file)
        file_obj.save(location)
        return True

    except:
        print("Unexpected error:", sys.exc_info()[0])
        return False


@app.route(API_ENTRY + '/ubuildit', methods=['POST'])
def ubuildit():
    """
    This route is used for uploading a UBuildIt Cost Review excel file.
    """
    # get length of request
    file_obj = request.files['file']
    user_id = request.form['user_id']
    criterion = [file_obj, user_id]

    if not all(criterion):
        return make_response('Bad request', 400)

    if upload_file(UPLOAD_PATH, file_obj.name, file_obj):
        try:
            secured_file = secure_filename(file_obj.name)
            wb = open_workbook(filename=''.join([UPLOAD_PATH, secured_file]))
            ws = wb.sheet_by_name('UBI Cost Review')
            # Parse file
            return make_response('File was successfully uploaded', 201)
        except:
            return make_response('Excel file could not be read', 400)
    else:
        return make_response('Failed to upload file', 400)
