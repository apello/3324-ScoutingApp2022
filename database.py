import csv
import sqlite3
import re
import json

# constant variables/values 
constants = json.load(open('./static/constants.json'))

# create table
def create_table(table):
    # connect to file
    conn = sqlite3.connect('scouting.db')
    # write object
    cursor = conn.cursor()
    # create table using values from json file
    try:
        # table = name of table, i.e., match/programming etc.
        # column values are constants from constant.json, i.e, tuple(["questionIndexes"]["match"]) = ("team_number", "match_number", etc.)
        cursor.execute('''CREATE TABLE ''' + str(table) + " " + str(tuple(constants["questionIndexes"][table])))
    # else output error
    except Exception as e: print(e)

# data = dictionary table; reference server.py
# submit_form(["beep", "boop"], "match")
def submit_form(data, table):
    # connect to db
    conn = sqlite3.connect('scouting.db')
    # declare sql cursor
    cursor = conn.cursor()
    # declare sql inert statment
    sqlString = "INSERT INTO " + table + " VALUES "
    dataString = ""
    # add data through insert data
    # loop through length of 
    for x in range (len(data)):
        # at the start of index, from value block
        if (x == 0):
            sqlString += "(?"
        # idk what this is
        else:
            sqlString += ",?"
    # end value block
    sqlString += ")"
    # stage statment
    cursor.execute(sqlString, tuple(data))
    # commit to db
    conn.commit()

# select func
def getData():
    # connect to db
    conn = sqlite3.connect('scouting.db')
    # declare sql cursor
    cursor = conn.cursor()
    # intialize data
    data = {}
    # loop through each table
    for item in constants["tables"]:
        # select data from them
        cursor.execute("SELECT * FROM " + item)
        # dump that data into data[] using fetchall
        data[item] = json.dumps(cursor.fetchall())
    # return data duh
    return data

# generate csv
def create_csv(table):
    conn = sqlite3.connect('scouting.db')
    cursor = conn.cursor()
    # grab data from db
    data = cursor.execute("SELECT * FROM " + table)
    # open csv file, write
    with open(table + '.csv', 'w', encoding="UTF-8", newline='') as f:
        # csv write obj
        writer = csv.writer(f)
        # write column names
        writer.writerow(constants["questions"][table])
        # write data
        writer.writerows(data)
