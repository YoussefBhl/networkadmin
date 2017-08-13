from flask import Flask ,request,jsonify
from flask_restful import Resource, Api,reqparse
from flask.ext.cors import CORS
from  collect_data import perse_results, try_to_connect,run_cli_command
from db_manager import db_login,db_deviceList,db_userList,db_changeDevice,db_addDevice,db_deleteDevice,db_changeUserConf,db_addUser,db_deleteUser
# MySQL configurations
selectedSwitchID = -1

app = Flask(__name__)
api = Api(app)
CORS(app)

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
        return db_deviceList("switchs")
api.add_resource(switchsList, '/switchsList')

class cameraList(Resource):
    def get(self):
        return db_deviceList("camera")
api.add_resource(cameraList, '/cameraList')

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
            parser.add_argument('switch', type=str)
            parser.add_argument('model', type=str)
            args = parser.parse_args()
            _switch = args['switch']
            selectedSwitchID = _switch[0]
            selectedSwitchModel = args['model']

            if(selectedSwitchModel == "HP"):
                vlan_command = "show vlan"
                int_command = "show interfaces status | include connected"
                int_textfsm = "textfsm/show_interfaces.textfsm"
                vlan_textfsm = "textfsm/show_vlans.textfsm"

            else:
                vlans_command = "show vlan"
                int_command = "show interfaces status | include connected"
                int_textfsm = "textfsm/show_interfaces.textfsm"
                vlan_textfsm = "textfsm/show_vlans.textfsm"
            
            file_ = open("show_connected_int.txt",'r')
            #cli_rslt = run_cli_command(_switch[2],_switch[3],_switch[4],show_int_command)
            interfaces = perse_results(file_.read(),int_textfsm)
            file_.close()
            file_ = open("show_vlan.txt",'r')
            #cli_rslt = run_cli_command(_switch[2],_switch[3],_switch[4],show_vlans_command)
            vlans = perse_results(file_.read(),vlan_textfsm)
            file_.close()
            return jsonify({'vlans':vlans,'interfaces':interfaces})
        except Exception as e:
            return {'error': str(e)}
api.add_resource(selectedSwitch, '/selectedSwitch')

class changeDevice(Resource):
    def post(self):
        #change swtich info in db
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=str)
        parser.add_argument('name', type=str)
        parser.add_argument('ip', type=str)
        parser.add_argument('username', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('model', type=str)
        parser.add_argument('tableName', type=str)
        args = parser.parse_args()
        _id = args['id']
        _name = args['name']
        _ip = args['ip']
        _username= args['username']
        _password = args['password']
        _model = args['model']
        _tableName = args['tableName']
        
        return db_changeDevice(_tableName,_name,_ip,_username,_password,_model,_id)

        
api.add_resource(changeDevice, '/changeDevice')

class addDevice(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str)
            parser.add_argument('ip', type=str)
            parser.add_argument('username', type=str)
            parser.add_argument('password', type=str)
            parser.add_argument('model', type=str)
            parser.add_argument('tableName', type=str)
            args = parser.parse_args()
            _name = args['name']
            _ip = args['ip']
            _username= args['username']
            _password = args['password']
            _model = args['model']
            _tableName = args['tableName']
            
            return db_addDevice(_tableName,_name,_ip,_username,_password,_model)
        except Exception as e:
            return {'error': str(e)}
api.add_resource(addDevice, '/addDevice')

#delete switch 
class deleteDevice(Resource):
    def post(self):
        try:
            #change swtich info in db
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=str)
            parser.add_argument('tableName', type=str)
            args = parser.parse_args()
            _id = args['id']
            _tableName = args['tableName']
            #data = cursor.fetchall()
            return db_deleteDevice(_tableName,_id)

        except Exception as e:
            return {'error': str(e)}
api.add_resource(deleteDevice, '/deleteDevice')
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
