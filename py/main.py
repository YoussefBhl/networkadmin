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
            #connect to db 
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute("SELECT  * FROM superuser WHERE username=%s AND password = %s;",(_username,_userPassword))
            data = cursor.fetchall()
            cursor.close()
            #test if SuperUser exists
            if (len(data) > 0):
                if (str(data[0][2]) == _userPassword):
                    return jsonify(data[0])
                else:
                    return {'status': 100, 'message': 'Authentication failure'}
            else:
                 #test if user exists
                cursor = conn.cursor()
                cursor.execute("SELECT  * FROM user WHERE username=%s AND password = %s;",(_username,_userPassword))
                data = cursor.fetchall()
                cursor.close()
                if (len(data) > 0):
                    if (str(data[0][2]) == _userPassword):
                        return jsonify(data[0])
                    else:
                        return {'status': 100, 'message': 'Authentication failure'}
            
                return {'status': 100, 'message': 'Authentication failure'}
        except Exception as e:
            return {'error': str(e)}

api.add_resource(AuthenticateUser, '/AuthenticateUser')


class switchsList(Resource):
    def get(self):
        try:
            #connect to db and return all switchs
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM switchs ")
            data = cursor.fetchall()
            cursor.close()
            final_data = []
            for switch in data:
                rslt = try_to_connect(switch[2],switch[3],switch[4])
                final_data.append(rslt)
            return jsonify(data,final_data)

        except Exception as e:
            return {'error': str(e)}
api.add_resource(switchsList, '/switchsList')

class selectedSwitch(Resource):
    def post(self):
        global selectedSwitchID
        try:
            #return switch's data by establishing ssh connection using netmiko
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

class changeSwitch(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=str)
            parser.add_argument('name', type=str)
            parser.add_argument('ip', type=str)
            parser.add_argument('username', type=str)
            parser.add_argument('password', type=str)
            parser.add_argument('model', type=str)

            args = parser.parse_args()
            _id = args['id']
            _name = args['name']
            _ip = args['ip']
            _username= args['username']
            _password = args['password']
            _model = args['model']

            conn = mysql.connect()
            cursor = conn.cursor()
            data = cursor.execute("UPDATE switchs SET switchName = %s ,IP = %s, username = %s, password = %s, model = %s where ID = %s;",(_name,_ip,_username,_password,_model,_id))
            conn.commit()
            #data = cursor.fetchall()
            cursor.close()
            return data

        except Exception as e:
            return {'error': str(e)}
api.add_resource(changeSwitch, '/changeSwitch')

class addSwitch(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str)
            parser.add_argument('ip', type=str)
            parser.add_argument('username', type=str)
            parser.add_argument('password', type=str)
            parser.add_argument('model', type=str)

            args = parser.parse_args()
            _name = args['name']
            _ip = args['ip']
            _username= args['username']
            _password = args['password']
            _model = args['model']

            conn = mysql.connect()
            cursor = conn.cursor()
            data = cursor.execute("INSERT INTO switchs(switchName,IP,username,password,model) VALUES(%s,%s,%s,%s,%s);",(_name,_ip,_username,_password,_model))
            conn.commit()
            #data = cursor.fetchall()
            cursor.close()
            return data

        except Exception as e:
            return {'error': str(e)}
api.add_resource(addSwitch, '/addSwitch')

#delete switch 
class deleteSwitch(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=str)

            args = parser.parse_args()
            _id = args['id']
            conn = mysql.connect()
            cursor = conn.cursor()
            data = cursor.execute("delete from switchs where ID = %s",(_id))
            conn.commit()
            #data = cursor.fetchall()
            cursor.close()
            return data

        except Exception as e:
            return {'error': str(e)}
api.add_resource(deleteSwitch, '/deleteSwitch')


if __name__ == '__main__':
    app.run(debug=True)
