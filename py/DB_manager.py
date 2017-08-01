#!/usr/bin/python

import mysql.connector
from mysql.connector import errorcode
from datetime import datetime



cnx = mysql.connector.connect(host='localhost', database='mydb', user='app', password='ukcuf')
def check_super_user(user_input,user_password):
	cursor = cnx.cursor()
	query = ("SELECT  Count(username) FROM superuser WHERE username=%s AND password = %s;")
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