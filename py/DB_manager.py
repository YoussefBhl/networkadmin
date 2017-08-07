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
def db_switchsList():
	cursor = db.cursor()
	cursor.execute("SELECT * FROM switchs;")
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

def db_changeSwitch(_name,_ip,_username,_password,_model,_id):
	cursor = db.cursor()
	data = cursor.execute("UPDATE switchs SET switchName = %s ,IP = %s, username = %s, password = %s, model = %s where ID = %s;",(_name,_ip,_username,_password,_model,_id))
	db.commit()
	cursor.close()
	return jsonify(data)	

def db_addSwitch(_name,_ip,_username,_password,_model):
	cursor = db.cursor()
	data = cursor.execute("INSERT INTO switchs(switchName,IP,username,password,model) VALUES(%s,%s,%s,%s,%s);",(_name,_ip,_username,_password,_model))
	db.commit()
	#data = cursor.fetchall()
	cursor.close()
	return data
def db_deleteSwitch(_id):
	cursor = db.cursor()
	query = "delete from switchs where ID = '{0}';".format(_id)
	data = cursor.execute(query)
	db.commit()
	cursor.close()
	return jsonify(data)
	
