from flask import Flask ,request,jsonify
from flask_restful import Resource, Api,reqparse
from flask.ext.cors import CORS
from flask.ext.mysql import MySQL
from  collect_data import perse_results, try_to_connect
mysql = MySQL()
# MySQL configurations
selectedSwitchID = -1

app = Flask(__name__)
api = Api(app)
CORS(app)
app.config['MYSQL_DATABASE_USER'] = 'app'
app.config['MYSQL_DATABASE_PASSWORD'] = 'ukcuf'
app.config['MYSQL_DATABASE_DB'] = 'mydb'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

class AuthenticateUser(Resource):
    def post(self):
        try:
            # Parse the arguments

            parser = reqparse.RequestParser()
            parser.add_argument('username', type=str, help='username for Authentication')
            parser.add_argument('password', type=str, help='Password for Authentication')
            args = parser.parse_args()

            _username = args['username']
            _userPassword = args['password']

            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.callproc('sp_AuthenticateSuperuser', (_username,))
            data = cursor.fetchall()
            print (data)
            if (len(data) > 0):
                if (str(data[0][2]) == _userPassword):
                    return {'status': 200, 'UserId': str(data[0][0])}
                else:
                    return {'status': 100, 'message': 'Authentication failure'}

        except Exception as e:
            return {'error': str(e)}

api.add_resource(AuthenticateUser, '/AuthenticateUser')


class switchsList(Resource):
    def get(self):
        try:
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM switchs ")
            data = cursor.fetchall()
            final_data = []
            for switch in data:
                rslt = try_to_connect(switch[2],switch[3],switch[4])
                final_data.append(rslt)
            return jsonify(data,final_data)

        except Exception as e:
            return {'error': str(e)}
api.add_resource(switchsList, '/switchsList')

class switchInfo(Resource):
    def get(self):
        global selectedSwitchID
        try:

            '''if (len(data) > 0):
                return jsonify(data)
            else:
                return {'status': 100, 'message': 'Authentication failure'}'''

        except Exception as e:
            return {'error': str(e)}
api.add_resource(switchInfo, '/switchInfo')

class selectedSwitch(Resource):
    def post(self):
        global selectedSwitchID
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('ID', type=str)
            args = parser.parse_args()
            _ID = args['ID']
            selectedSwitchID = _ID
            file_ = open("show_connected_int.txt",'r')
            interfaces = perse_results(file_.read(),"interfaces.textfsm",'inter')
            file_.close()
            file_ = open("show_vlan.txt",'r')
            vlans = perse_results(file_.read(),"test.textfsm",'vlans')
            file_.close()
            #output['vlans'].append(ok)  
            return jsonify({'vlans':vlans,'interfaces':interfaces})
        except Exception as e:
            return {'error': str(e)}
api.add_resource(selectedSwitch, '/selectedSwitch')



if __name__ == '__main__':
    app.run(debug=True)
