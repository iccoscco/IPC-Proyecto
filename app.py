from flask import Flask, render_template, request, redirect
import pymysql

app = Flask(__name__)

# Función de conexión a MySQL con pymysql
def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='sistema',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/')
def index():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM usuarios")  # Asegúrate de tener una tabla llamada 'productos'
            productos = cursor.fetchall()
    return render_template('index.html', productos=productos)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
