from flask import *
import database
import getJson
import sys
from os import system

import json

#try:
#    if sys.argv[1] != "":
#        event_key = sys.argv[1]
#except:
#event_key = "2019paca"
system("python3 getJson.py " + "2019tes")
app = Flask(__name__)

# constant values
constants = json.load(open('./static/constants.json'))

# create db using constants
for item in constants["tables"]:

    database.create_table(item)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

# dump data from database and constants and feed to raw_data
@app.route('/graphs', methods=['GET', 'POST'])
def graphs():
    # getData() [pulls all data from db] from db.py, return template, dump data there
    data = database.getData()
    return render_template('data_viewer/graphs.html', allData=json.dumps(data), constants=json.dumps(constants)) # send all db info, constants.json

 
# dump data from database and constants and feed to raw_data
@app.route('/raw_data', methods=['GET', 'POST'])
def raw_data():
    # getData() [pulls all data from db] from db.py, return template, dump data there
    data = database.getData()
    return render_template('data_viewer/raw_data.html', allData=json.dumps(data), constants=json.dumps(constants)) # send all db info, constants.json

@app.route('/exports', methods=['GET', 'POST'])
def exports():

    return render_template('data_viewer/exports.html')

@app.route('/calculated_team_averages', methods=['GET', 'POST'])
def calculated_team_averages():
    # getData() [pulls all data from db] from db.py, return template, dump data there
    data = database.getData()
    return render_template('data_viewer/calculated_team_averages.html', allData=json.dumps(data), constants=json.dumps(constants))

@app.route('/form', methods=['GET', 'POST'])

    # sends match type, i.e., form?type=match = match_scouting.html
    # used on index.html to load pages
def return_form():
    return render_template('forms/' + request.args.get('type') + '_scouting.html')

@app.route('/submit', methods=['GET', 'POST'])

def submit_form():
    answerList = []

    # request.args.get('form') = <form action="submit?form=match">
    # loop through len(["questions"]["match"]) => 0->16 in constant.json
    # !!! why loop using len of questions and not questionIndexes?
    for x in range(len(constants["questions"][request.args.get('form')])): 
        # at index[x], append to answerList values of ["questionIndex"]["match"][x]
        answerList.append(request.form[constants["questionIndexes"][request.args.get('form')][x]])
    # submit the answerList array to the database in the "match" column
    database.submit_form(answerList, request.args.get('form'))
    # return submitted page
    return render_template('submitted.html')

@app.route('/csv_export', methods=['GET', 'POST'])
def csv_export():
    # create_csv() from db.py using table name
    database.create_csv(request.args.get('table'))
    # return csv file as attachment
    return send_file(request.args.get('table') + '.csv', as_attachment=True)

@app.route('/icon.png', methods=['GET', 'POST'])
def icon():
    # return the logo
    return send_file('icon.png')

@app.route('/teamInformation.json', methods=['GET', 'POST'])
def teamInformation():
    # return teamInfo.json
    return send_file('teamInformation.json')

@app.route('/autofill.js', methods=['GET', 'POST'])
def autofill():
    # return autofill.js
    return send_file('autofill.js')

if __name__ == '__main__': app.run(host='0.0.0.0',port='8080')
