#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    app.utility
    ~~~~~~~~~~~~~~

    This module implements the utility functions.

    Functions:
    -parse_invoice_file
    -parse_ubuildit_file
"""

from datetime import date
from xlrd import open_workbook, xldate_as_tuple


def parse_invoice_file(path):
    """
    Parses the Invoice Excel file.
        :param path: the location of the file
    """
    wb = open_workbook(filename=path)
    ws = wb.sheet_by_name('Invoices indexed by date')

    expenditure_list = []

    for i in range(2, 140):
        cells = ws.row_slice(rowx=i,
                             start_colx=1,
                             end_colx=6)

        date_tuple = xldate_as_tuple(cells[0].value, 0)
        year, month, day, hour, minutes, seconds = date_tuple

        expenditure_list.append({
            'date':        str(date(year, month, day)),
            'vendor':      cells[1].value,
            'description': cells[2].value,
            'cost':        convert_to_float(cells[3].value),
            'notes':       cells[4].value
        })
    return expenditure_list


def parse_ubuildit_file(data):
    """
    Parses the UBuildIt Excel file.
        :param key: AWS bucket key
        :return:
            category_list: {
                'category_name:' 'name_of_category',
                'item_list': 'list_of_items[]'
            }
    """
    wb = open_workbook(file_contents=data)
    ws = wb.sheet_by_name('UBI Cost Review')

    category_list = []
    category_list.append({'category_name': ws.cell_value(5, 2),
                          'item_list':     get_item_list(ws, 6, 15)})
    category_list.append({'category_name': ws.cell_value(16, 2),
                          'item_list':     get_item_list(ws, 17, 33)})
    category_list.append({'category_name': ws.cell_value(34, 2),
                          'item_list':     get_item_list(ws, 35, 43)})
    category_list.append({'category_name': ws.cell_value(44, 2),
                          'item_list':     get_item_list(ws, 45, 47)})
    category_list.append({'category_name': ws.cell_value(48, 2),
                          'item_list':     get_item_list(ws, 49, 52)})
    category_list.append({'category_name': ws.cell_value(53, 2),
                          'item_list':     get_item_list(ws, 54, 60)})
    category_list.append({'category_name': ws.cell_value(61, 2),
                          'item_list':     get_item_list(ws, 62, 93)})
    category_list.append({'category_name': ws.cell_value(94, 2),
                          'item_list':     get_item_list(ws, 95, 130)})
    return category_list


def get_item_list(ws, start, end):
    """
    Get item list from excel file.
        :param ws: excel worksheet object
        :param start: start position to read row of file
        :param end: end position to read row of file
        :return: Returns the item_list parsed
    """
    temp_list = []

    for i in range(start, end):
        cells = ws.row_slice(rowx=i,
                             start_colx=2,
                             end_colx=10)
        temp_list.append({
            'cost_category':     cells[0].value,
            'description':       cells[1].value,
            'estimated':         convert_to_float(cells[2].value),
            'actual':            convert_to_float(cells[3].value),
            'change_orders':     cells[4].value,
            'over_under_budget': cells[5].value,
            'total_cost':        cells[6].value,
            'explanations':      cells[7].value
        })
    return temp_list


def convert_to_float(s):
    """
    Converts a String into int or float.
        :param s: String
        :return: Returns an int or float
    """
    if isinstance(s, float):
        return round(s, 2)
    if s == '':
        return 0.0
    try:
        return int(s)
    except ValueError:
        return float(s)
