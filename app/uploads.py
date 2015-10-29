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


API_ENTRY = '/api/upload'

@app.route(API_ENTRY + '/ubuildit', methods=['POST'])
def ubuildit():
    data = request.get_json(force=True)
    temp_file = data.get('file', None)
    user_id = data.get('user_id', None)
    criterion = [temp_file, user_id, len(data) == 2]

    if not all(criterion):
        return make_response('Could not upload file', 400)

    #if upload_file(temp_file) and check_file(temp_file):
    #    parsed_file = parse_file(temp_file)
    return make_response('File was successfully uploaded', 201)
