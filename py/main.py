from flask import Flask ,request,jsonify
from flask_restful import Resource, Api,reqparse
from flask.ext.cors import CORS
from flask.ext.mysql import MySQL
from  collect_data import perse_results, try_to_connect
from db_manager import db_login,db_switchsList,db_userList,db_changeSwitch,db_addSwitch,db_deleteSwitch,db_changeUserConf,db_addUser,db_deleteUser
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
        # Parse the arguments
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, help='username for Authentication')
        parser.add_argument('password', type=str, help='Password for Authentication')
        args = parser.parse_args()
        _username = args['username']
        _userPassword = args['password']
        #connect to db 
        return db_login(_username,_userPassword)
        
api.add_resource(AuthenticateUser, '/AuthenticateUser')


class switchsList(Resource):
    def get(self):
        return db_switchsList()
api.add_resource(switchsList, '/switchsList')

class usersList(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=str)
        args = parser.parse_args()
        _id = args['id']
        return db_userList(_id)

        
api.add_resource(usersList, '/usersList')

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
        
        return db_changeSwitch(_name,_ip,_username,_password,_model,_id)

        
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
            return db_addSwitch(_name,_ip,_username,_password,_model)
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
            #data = cursor.fetchall()
            return db_deleteSwitch(_id)

        except Exception as e:
            return {'error': str(e)}
api.add_resource(deleteSwitch, '/deleteSwitch')
class changeUserConf(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('role', type=str)
            parser.add_argument('id', type=str)
            parser.add_argument('username', type=str)
            parser.add_argument('password', type=str)

            args = parser.parse_args()
            _role = args['role']
            _id = args['id']
            _password = args['password']
            _username = args['username']
            if(_role == "0"):
                userTableName = "superUser"
                otherTableName = "user"
            else:
                userTableName = "user"
                otherTableName = "superUser"
            return db_changeUserConf(otherTableName,userTableName,_username,_password,_id)    
        except Exception as e:
            return {'error': str(e)}
api.add_resource(changeUserConf, '/changeUserConf')
class addUser(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('role', type=str)
            parser.add_argument('username', type=str)
            parser.add_argument('password', type=str)
            args = parser.parse_args()
            _role = args['role']
            _password = args['password']
            _username = args['username']
            if(_role == "Admin"):
                _role = 0
                userTableName = "superUser"
                otherTableName = "user"
            else:
                _role = 1
                userTableName = "user"
                otherTableName = "superUser"

            #data = cursor.fetchall()
            return db_addUser(otherTableName,userTableName,_username,_password,_role)

        except Exception as e:
            return {'error': str(e)}
api.add_resource(addUser, '/addUser')
class deleteUser(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=str)
            parser.add_argument('role', type=str)
            args = parser.parse_args()
            _id = args['id']
            _role = args['role']
            if(_role == "0"):
                userTableName = "superUser"
            else:
                userTableName = "user"
            #data = cursor.fetchall()
            return db_deleteUser(userTableName,_id)
        except Exception as e:
            return {'error': str(e)}
api.add_resource(deleteUser, '/deleteUser')
if __name__ == '__main__':
    app.run(debug=True)
