#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.uploads
    ~~~~~~~~~~~~~~

    This module is used for uploading files.

    Current APIs:
        -ubuildit : /api/upload/ubuildit
"""

from flask import make_response, request

from app import app
from app.utility import allowed_file, upload_file, check_file


API_ENTRY = '/api/upload'

@app.route(API_ENTRY + '/ubuildit', methods=['POST'])
def ubuildit():
    """
    This route is used for uploading a UBuildIt Cost Review excel file.
    """
    data = request.get_json(force=True)
    filename = data.get('filename', None)
    temp_file = data.get('file', None)
    user_id = data.get('user_id', None)
    criterion = [filename, temp_file, user_id, len(data) == 3]

    if not all(criterion):
        return make_response('Bad request', 400)

    if allowed_file(filename):
        if upload_file(filename, temp_file):
            if check_file(filename):
                # parse file
                return make_response('File was successfully uploaded', 201)
            else:
                return make_response('Different excel file', 400)
        else:
            return make_response('Failed to upload file', 400)
    else:
        return make_response('Wrong file extension', 400)
