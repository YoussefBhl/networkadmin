import mysql.connector
from flask import  jsonify
from  collect_data import perse_results, try_to_connect

db = mysql.connector.connect(host='localhost', database='mydb', user='app', password='ukcuf')
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
def db_deviceList(tableName):
	cursor = db.cursor()
	query = "SELECT * FROM {0};".format(tableName)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	final_data = []
	for switch in data:
		rslt = try_to_connect(switch[2],switch[3],switch[4]) #var in : Ip username password
		final_data.append(rslt)
	return jsonify(data,final_data)
def db_userList(_id):
	cursor = db.cursor()
	query = "select * from superuser where ID <> {0};".format(_id)
	cursor.execute(query)
	data = cursor.fetchall()
	cursor.close()
	cursor = db.cursor()
	cursor.execute("SELECT * FROM user")
	data = data +cursor.fetchall()
	cursor.close()
	return jsonify(data)

def db_changeDevice(_tableName,_name,_ip,_username,_password,_model,_id):
	cursor = db.cursor()
	query = "UPDATE {0} SET deviceName = '{1}' ,IP = '{2}', username = '{3}', password = '{4}', model = '{5}' where ID = '{6}';".format(_tableName,_name,_ip,_username,_password,_model,_id)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return data	

def db_addDevice(_tableName,_name,_ip,_username,_password,_model):
	cursor = db.cursor()
	query = "INSERT INTO {0}(deviceName,IP,username,password,model) VALUES('{1}','{2}','{3}','{4}','{5}');".format(_tableName,_name,_ip,_username,_password,_model)
	data = cursor.execute(query)
	db.commit()
	#data = cursor.fetchall()
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

