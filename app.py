from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import bcrypt

import bcrypt

def hash_senha(senha):
    # Gerar um hash seguro da senha
    senha_bytes = senha.encode('utf-8')  # Converte para bytes
    salt = bcrypt.gensalt()  # Gera um salt aleatório
    hashed = bcrypt.hashpw(senha_bytes, salt)  # Aplica o hash
    return hashed

# Exemplo
senha_hash = hash_senha("minha_senha_secreta")
print(senha_hash)  # Exemplo de saída: b'$2b$12$X6Gf...'

def verificar_senha(senha_digitada, senha_armazenada):
    senha_bytes = senha_digitada.encode('utf-8')
    return bcrypt.checkpw(senha_bytes, senha_armazenada)

# Exemplo de uso:
senha_correta = verificar_senha("minha_senha_secreta", senha_hash)
print(senha_correta)  # True se a senha estiver correta


app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500"])  # Permite chamadas de outro domínio (frontend)

# Configuração do MySQL
db = mysql.connector.connect(
    host="localhost",
    user="JAY",
    password="JAY12398",
    database="quiz_gb"
)
cursor = db.cursor()

cursor.execute("SELECT * FROM users")
result = cursor.fetchall()

for row in result:
    print(row)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    user_password = data['user_password']

    if not username or not email or not user_password:
        return jsonify({"error": "Dados incompletos!"}), 400

    # Criptografa a senha antes de salvar
    senha_hash = bcrypt.hashpw(user_password.encode('utf-8'), bcrypt.gensalt())

    try:
        cursor.execute("INSERT INTO users (username, email, user_password) VALUES (%s, %s, %s)",
                       (username, email, senha_hash))
        db.commit()
        return jsonify({"message": "Conta criada com sucesso!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro ao salvar no banco de dados: {err}"}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    user_password = data['user_password']

    # Busca o usuário no banco
    cursor.execute("SELECT user_password FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    if user:
        senha_armazenada = user[0].encode('utf-8')  # Converte para bytes

        if bcrypt.checkpw(user_password.encode('utf-8'), senha_armazenada):
            return jsonify({"message": "Login bem-sucedido!", "username": username})
        else:
            return jsonify({"error": "Senha incorreta!"}), 401
    else:
        return jsonify({"error": "Usuário não encontrado!"}), 404
    
    
    
# Iniciar o servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
