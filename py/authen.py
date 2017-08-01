import sys
import hashlib
import getpass

def main(admin_auth_file,user_auth_file):

	print '\nPassword Request Program v.04\n'

	try:
		#read admin adn user authen file
		#save user and password
		admin_file = open(admin_auth_file)
		admin = admin_file.readline()[:-1]
		admin_pass = admin_file.readline()[:-1]

		user_file = open(user_auth_file)
		user = admin_file.readline()[:-1]
		user_pass = admin_file.readline()[:-1]

		admin_file.close()
		user_file.close()
	except:
		sys.exit('There was a problem reading the file!')

	pass_try = 0
	x = 3
	#user to try to login 3 times
	while pass_try <3:
		#crypt the inputs and testing it
		user_input = hashlib.sha224(raw_input('Please Enter user: ')).hexdigest()
		pass_input = hashlib.sha224(raw_input('Please Enter Password: ')).hexdigest()
		if (pass_input == admin_pass and admin == user_input) or (pass_input == user_pass and user == user_input):
			pass_try = 4
		else:
			pass_try += 1
			print 'Incorrect Password, ' + str(x - pass_try) + ' more attempts left\n'

	if pass_try == x :
		sys.exit('Incorrect Password, terminating... \n')

	print 'User is logged in!\n'


main("admin.psw","user.psw")