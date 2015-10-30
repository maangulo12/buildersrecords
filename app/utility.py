#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
    app.utility
    ~~~~~~~~~~~~~~

    This module implements the utility functions of this application.
"""

import os
import sys
from xlrd import open_workbook
from werkzeug import secure_filename

from app.settings import ALLOWED_EXTENSIONS, UPLOAD_FOLDER


def allowed_file(filename):
    """
    Checks filename extension.
    :param filename: filename with extension
    :return: True if filename extension is allowed
    """
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def upload_file(temp_filename, temp_file):
    """
    Saves a file to UPLOAD_FOLDER.
    :param file: a file object
    :return: True if the file is saved
    """
    try:
        filename = secure_filename(temp_filename)
        location = os.path.join(UPLOAD_FOLDER, filename)
        temp_file.save(location)
        return True

    except:
        print("Unexpected error:", sys.exc_info()[0])
        return False


def check_file(temp_filename):
    """
    Checks the UBuildIt Cost Review excel file.
    :param file: a file object
    :return: True if the file is the correct file
    """
    try:
        filename = secure_filename(temp_filename)
        wb = open_workbook(filename = ''.join([UPLOAD_FOLDER, filename]))
        ws = wb.sheet_by_name('UBI Cost Review')
        return True

    except:
        print("Unexpected error:", sys.exc_info()[0])
        return False
