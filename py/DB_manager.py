#!/usr/bin/python

from datetime import datetime
from flask.ext.mysql import MySQL


cnx = mysql.connector.connect(host='localhost', database='mydb', user='app', password='ukcuf')
def check_super_user(user_input,user_password):
	cursor = cnx.cursor()
	query = ("SELECT  * FROM superuser WHERE username=%s AND password = %s;")
	cursor.execute(query,(user_input,user_password))
	rows = cursor.fetchall()
	cursor.close()
	return rows[0][0]
def check_user(user_input,user_password):
	cursor = cnx.cursor()
	query = ("SELECT  Count(username) FROM user WHERE username=%s AND password = %s;")
	cursor.execute(query,(user_input,user_password))
	rows = cursor.fetchall()
	cursor.close()
	return rows[0][0]
