from flask import Flask ,request,jsonify
from flask_restful import Resource, Api,reqparse
from flask.ext.cors import CORS
from  collect_data import *
from db_manager import *
import os
import subprocess
# MySQL configurations
selectedSwitchID = -1

app = Flask(__name__)
api = Api(app)
CORS(app)
dir_path = os.path.dirname(os.path.realpath(__file__))
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

class devicesList(Resource):
    def get(self):
        return db_deviceList("devices")
api.add_resource(devicesList, '/devicesList')

class cameraList(Resource):
    def get(self):
        return db_CameraList("devices")
api.add_resource(cameraList, '/cameraList')       
class routerList(Resource):
    def get(self):
        return db_routerList("devices")
api.add_resource(routerList, '/routerList')
class otherList(Resource):
    def get(self):
        return db_otherList("devices")
api.add_resource(otherList, '/otherList')


class getSwitchStatus(Resource):
    def post(self):
          # Parse the arguments
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=str)
        parser.add_argument('tableName', type=str)
        parser.add_argument('index', type=str)
        args = parser.parse_args()
        _id = args['id']
        _index = args['index']
        _tableName = args['tableName']

        return [_index,db_getDeviceStatus(_id,_tableName)]
api.add_resource(getSwitchStatus, '/getSwitchStatus')

class getDeviceStatus(Resource):
    def post(self):
          # Parse the arguments
        parser = reqparse.RequestParser()
        parser.add_argument('ip', type=str)
        parser.add_argument('index', type=str)
        args = parser.parse_args()
        _index = args['index']
        _ip = args['ip']
        #response = os.system("ping -n 1 " + _ip)
        output = subprocess.Popen(["ping.exe","-n","1",_ip],stdout = subprocess.PIPE).communicate()[0]
        if ('unreachable' in output):
            return [_index,'deactive']
        elif('timed out' in output):
            return [_index,'deactive']
        elif("could not find" in output):
            return [_index,'deactive']
        else:
            return [_index,'active']
        
api.add_resource(getDeviceStatus, '/getDeviceStatus')



class usersList(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=str)
        args = parser.parse_args()
        _id = args['id']

        return db_userList(_id)
api.add_resource(usersList, '/usersList')

class selectedHP(Resource):
    def post(self):
        global selectedSwitchID
        try:
            #return switch's data by establishing ssh connection using netmiko
            parser = reqparse.RequestParser()
            parser.add_argument('ip', type=str)
            parser.add_argument('model', type=str)
            parser.add_argument('username', type=str)
            parser.add_argument('password', type=str)
            args = parser.parse_args()
            _ip = args['ip']
            _username = args['username']
            _password = args['password']
            _model = args['model']
            os.chdir(dir_path)

            vlans_command = "show vlans"
            arp_command = "show arp"
            tech_command = "show tech buffers"
            system_command  = "show system-information"
            #textfsm template
            arp_textfsm = "textfsm/hp_show_arp.textfsm"
            vlan_textfsm = "textfsm/hp_show_vlans.textfsm"
            tech_textfsm = "textfsm/hp_show_tech.textfsm"
            system_textfsm = "textfsm/hp_show_system.textfsm"

            commandsList = [vlans_command,arp_command,tech_command,system_command]
            outputCLI = run_cli_command(_ip,_username,_password,_model,commandsList)
            vlans = perse_results(outputCLI[0],vlan_textfsm)
            arp = perse_results(outputCLI[1], arp_textfsm)
            tech = perse_results(outputCLI[2], tech_textfsm)
            system = perse_results(outputCLI[3], system_textfsm)
            return jsonify({'vlans':vlans,'arp':arp,'tech':tech,'system':system})

        except Exception as e:
            return {'error': str(e)}
api.add_resource(selectedHP, '/selectedHP')



class selectedCisco(Resource):
    def post(self):
        global selectedSwitchID
        try:
            #return switch's data by establishing ssh connection using netmiko
            parser = reqparse.RequestParser()
            parser.add_argument('ip', type=str)
            parser.add_argument('model', type=str)
            parser.add_argument('username', type=str)
            parser.add_argument('password', type=str)
            args = parser.parse_args()
            _ip = args['ip']
            _username = args['username']
            _password = args['password']
            _model = args['model']
            os.chdir(dir_path)
           
           #cisco commands
            vlans_command = "show vlan"
            int_command = "show interfaces status"
            transciver_command = "show interface transceiver"
            arp_command = "show ip arp"
            ip_int_command = "show ip int brief"
            cpu_command = "show processes cpu"
            version_command = "show version"
            mem_command = "show memory statistics"
            buff_command = "show buff"

            #textfsm template use it to perse the cli result to tables 
            int_textfsm = "textfsm/cisco_show_interfaces.textfsm"
            vlan_textfsm = "textfsm/cisco_show_vlans.textfsm"
            transciver_textfsm = "textfsm/cisco_show_interface_transceiver.textfsm"
            arp_textfsm = "textfsm/cisco_show_ip_arp.textfsm"
            ip_int_textfsm = "textfsm/cisco_show_ip_int_brief.textfsm"
            cpu_textfsm = "textfsm/cisco_show_processes_cpu.textfsm"
            version_textfsm = "textfsm/cisco_show_version.textfsm"
            mem_textfsm = "textfsm/cisco_show_mem_stat.textfsm"
            buff_textfsm = "textfsm/cisco_show_buff.textfsm"
            
            commandsList = [vlans_command,int_command,arp_command,ip_int_command,cpu_command,version_command,mem_command,buff_command]
            outputCLI = run_cli_command(_ip,_username,_password,_model,commandsList)
            vlans = perse_results(outputCLI[0],vlan_textfsm)
            interfaces = perse_results(outputCLI[1], int_textfsm)
            arp = perse_results(outputCLI[2], arp_textfsm)
            ip_int = perse_results(outputCLI[3], ip_int_textfsm)
            cpu = perse_results(outputCLI[4], cpu_textfsm)
            version = perse_results(outputCLI[5], version_textfsm)
            mem = perse_results(outputCLI[6], mem_textfsm)
            buff = perse_results(outputCLI[7], buff_textfsm)
            return jsonify({'vlans':vlans,'interfaces':interfaces,'buff':buff,'arp':arp,'ip_int':ip_int,'cpu':cpu,'version':version,'mem':mem})

        except Exception as e:
            return {'error': str(e)}
api.add_resource(selectedCisco, '/selectedCisco')

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
        parser.add_argument('type', type=str)
        args = parser.parse_args()
        _id = args['id']
        _name = args['name']
        _ip = args['ip']
        _username= args['username']
        _password = args['password']
        _model = args['model']
        _type = args['type']
        _tableName = args['tableName']
        #the device can be switch or device
        if(_tableName == "switchs"): 
            return db_changeSwitch(_name,_ip,_username,_password,_model,_id)
        else:
            return db_changeDevice(_name,_ip,_type,_id)

        
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
            parser.add_argument('type', type=str)
            args = parser.parse_args()
            _name = args['name']
            _ip = args['ip']
            _username= args['username']
            _password = args['password']
            _model = args['model']
            _type = args['type']
            _tableName = args['tableName']
            #the device can be switch or device
            if(_tableName == "switchs"): 
                return db_addSwitch(_name,_ip,_username,_password,_model)
            else:
                return db_addDevice(_name,_ip,_type)
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
            #the user can be admin or a simple user
            #we need the save the table's user that we need to modify and the otehr table 
            #to make sure that there is no deplucate names and to modify conf
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
            #the user can be admin or a simple user
            #we need the save the table's user that we need to modify and the otehr table 
            #to make sure that there is no deplucate names and to modify conf
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
    app.run(debug=True,threaded=True)
