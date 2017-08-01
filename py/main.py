from flask import Flask ,request,jsonify
from flask_restful import Resource, Api,reqparse
from flask.ext.cors import CORS
from flask.ext.mysql import MySQL
mysql = MySQL()
# MySQL configurations


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

            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.callproc('sp_AuthenticateSuperuser', (_username,))
            data = cursor.fetchall()
            print (data)
            if (len(data) > 0):
                if (str(data[0][2]) == _userPassword):
                    return {'status': 200, 'UserId': str(data[0][0])}
                else:
                    return {'status': 100, 'message': 'Authentication failure'}

        except Exception as e:
            return {'error': str(e)}

api.add_resource(AuthenticateUser, '/AuthenticateUser')


if __name__ == '__main__':
    app.run(debug=True)
