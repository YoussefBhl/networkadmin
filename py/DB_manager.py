import mysql.connector
from flask import  jsonify
from  collect_data import perse_results, try_to_connect
#connect to mydb
db = mysql.connector.connect(host='localhost', database='mydb', user='app', password='ukcuf') 

#the user login check if the user exists or not
def db_login(_username,_userPassword):
	
	cursor = db.cursor()
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
		cursor = db.cursor()
		cursor.execute("SELECT  * FROM user WHERE username=%s AND password = %s;",(_username,_userPassword))
		data = cursor.fetchall()
		cursor.close()
		if (len(data) > 0):
			if (str(data[0][2]) == _userPassword):
				return jsonify(data[0])
			else:
				return {'status': 100, 'message': 'Authentication failure'}
#return the devices ' list wich is database 
def db_deviceList(tableName):
	cursor = db.cursor()
	query = "SELECT * FROM {0};".format(tableName)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	return data 
def db_CameraList(tableName):
	cursor = db.cursor()
	query = "SELECT * FROM {0} where Type = 'camera';".format(tableName)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	return data
def db_routerList(tableName):
	cursor = db.cursor()
	query = "SELECT * FROM {0} where Type = 'router';".format(tableName)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	return data
	
def db_otherList(tableName):
	cursor = db.cursor()
	query = "SELECT * FROM {0} where Type = 'other';".format(tableName)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	return data

#we try to connect to the device (using netmiko) then return the result
def db_getDeviceStatus(_id,_tableName):
	thread_db = mysql.connector.connect(host='localhost', database='mydb', user='app', password='ukcuf')
	cursor = thread_db.cursor()
	query = "select * from {0} where ID = {1};".format(_tableName,_id)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	thread_db.close()
	return try_to_connect(data[0][2],data[0][3],data[0][4]) #var in : Ip username password

#return the users list (used to delete user by the admin)
def db_userList(_id):
	cursor = db.cursor()
	query = "select * from superuser where ID <> {0} AND ID <> 1;".format(_id)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	cursor = db.cursor()
	cursor.execute("SELECT * FROM user")
	data = data +cursor.fetchall()
	cursor.close()
	return jsonify(data)

def db_changeDevice(_name,_ip,_type,_id):
	cursor = db.cursor()
	query = "UPDATE devices SET deviceName = '{0}' ,IP = '{1}',Type = '{2}' where ID = '{3}';".format(_name,_ip,_type,_id)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return data	
#change the siwtch configuration
def db_changeSwitch(_name,_ip,_username,_password,_model,_id):
	cursor = db.cursor()
	query = "UPDATE switchs SET deviceName = '{0}' ,IP = '{1}', username = '{2}', password = '{3}', model = '{4}' where ID = '{5}';".format(_name,_ip,_username,_password,_model,_id)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return data		

def db_addDevice(_name,_ip,_type):
	cursor = db.cursor()
	query = "INSERT INTO devices(deviceName,IP,Type) VALUES('{0}','{1}','{2}');".format(_name,_ip,_type)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return data

def db_addSwitch(_name,_ip,_username,_password,_model):
	cursor = db.cursor()
	query = "INSERT INTO switchs(deviceName,IP,username,password,model) VALUES('{0}','{1}','{2}','{3}','{4}');".format(_name,_ip,_username,_password,_model)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return data
def db_deleteDevice(tableName,_id):
	cursor = db.cursor()
	query = "delete from {0} where ID = '{1}';".format(tableName,_id)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return jsonify(data)
def db_changeUserConf(otherTableName,userTableName,_username,_password,_id)	:
	cursor = db.cursor()
	query = "select * from {0} where username = '{1}';".format(otherTableName,_username)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	if (len(data) > 0):
		return jsonify({'error':'user already exists'})
	else:
		cursor = db.cursor()
		query = "update {0} set username='{1}',password='{2}' where ID='{3}';".format(userTableName,_username,_password,_id)
		data = cursor.execute(query)
		db.commit()
		cursor.close()
		return jsonify(data)
def db_addUser(otherTableName,userTableName,_username,_password,_role):
	cursor = db.cursor()
	query = "select * from {0} where username = '{1}';".format(otherTableName,_username)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	if (len(data) > 0):
		return jsonify({'error':'user already exists'})
	else:
		cursor = db.cursor()
		query = "INSERT INTO {0}(username,password,permession) VALUES('{1}','{2}','{3}');".format(userTableName,_username,_password,_role)
		data = cursor.execute(query)
		db.commit()
		cursor.close()
		return jsonify(data)

def db_deleteUser(tableName,_id):
	cursor = db.cursor()
	query = "delete from {0} where ID = '{1}';".format(tableName,_id)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return jsonify(data)

