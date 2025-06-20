"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
#hago estas importaciones 
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')



app = Flask(__name__)# no puede faltar llamar a flask
bcrypt = Bcrypt(app) #para encriptar
CORS(app)

app.url_map.strict_slashes = False
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_KEY') #para tener la llave fuera del codigo
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


#__________________POST /login ___________________________________________________________
#este endpoint POST verifica si el usuario existe y le crea un token
@app.route('/login', methods=['POST'])
def login():
    body= request.get_json(silent=True)
    #toma el cuerpo de la solicitud y Devuelve todo el objeto JSON como un diccionario de Python
    if body is None:
        return jsonify({'msg': 'debe haber un body'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'el campo email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'el campo password es obligatorio'}), 400
    user=User.query.filter_by(email=body['email']).first() # 
    if user is None:
        return jsonify({'msg': 'usuario o contraseña erronea'}), 400
    correct_password= bcrypt.check_password_hash(user.password, body['password'])
   # if user.password != body['password']: la linea anterior es la manera correcta de chequear si el password que escribimos es el mismo de la BD encriptado
    if not correct_password :
         return jsonify({'msg': 'usuario o contraseña erronea'}), 400
    access_token = create_access_token(identity=user.email) # aqui est GENERANDO EL TOKEN c esa funcion
    #y ademas estoy guardando junto al token el email del usuario
    print (user)
    return jsonify({'msg': 'ok', 'token': access_token, 'user': user.email}), 200

#___________________GET /protected __________________________________________________________
#aqui obtengo datos del area privada del usuario pasandole el token 
@app.route('/protected', methods= ['GET']) # Protect a route with jwt_required
@jwt_required() # este es el decorador que va a hacer q el enpoint solo devuelva el usuario q tiene el token
def protected():
    current_user = get_jwt_identity()  # Access the identity of the current user with get_jwt_identity
    return jsonify({'msg': f'accediendo a tu informacion privada {current_user}'}), 200

#__________________POST /register ___________________________________________________________
# endpoint para Registrar usuario con POST
@app.route('/signup', methods= ['POST'])
def register():
    body= request.get_json(silent=True)
    #toma el cuerpo de la solicitud y Devuelve todo el objeto JSON como un diccionario de Python
    if body is None:
        return jsonify({'msg': 'debe haber un body'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'el campo email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'el campo password es obligatorio'}), 400
    new_user= User() #variable q recibe una instacia de la clase User
    new_user.email= body['email'] #el campo email recibe lo que le pasamos en el body 
    #ahora encrpitamos la contraseña y la pasamos al campo password de la clase User q instanciamos
    new_user.password = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user.is_active=True
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': f'usuario {new_user} registrado con exito'} ), 200



# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
