from flask import Flask, render_template, request, redirect, session
from avatar_routes import avatar_bp 
import pymysql

app = Flask(__name__)
app.secret_key = 'IPC-Grup0'
app.register_blueprint(avatar_bp)

# Conexión a la base de datos
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
            cursor.execute("SELECT * FROM usuarios")
            usuarios = cursor.fetchall()
            
            cursor.execute("SELECT * FROM menu")
            menu = cursor.fetchall()

            cursor.execute("SELECT * FROM ingredientes")
            ingredientes = cursor.fetchall()

            cursor.execute("SELECT * FROM pedidos")
            pedidos = cursor.fetchall()

            cursor.execute("SELECT * FROM detalle_pedido")
            detalles = cursor.fetchall()

            cursor.execute("SELECT * FROM registro_voz")
            registros_voz = cursor.fetchall()

            cursor.execute("SELECT * FROM auditoria_acciones")
            auditorias = cursor.fetchall()

            cursor.execute("""
                SELECT p.id, r.nombre AS nombre_rol, p.tabla, p.puede_ver, p.puede_agregar, p.puede_modificar, p.puede_eliminar
                FROM permisos p
                JOIN roles r ON p.id_rol = r.id
            """)
            permisos = cursor.fetchall()

    return render_template(
        'index.html',
        usuarios=usuarios,
        menu=menu,
        ingredientes=ingredientes,
        pedidos=pedidos,
        detalles=detalles,
        registros_voz=registros_voz,
        auditorias=auditorias,
        permisos=permisos
    )

# ==== USUARIOS ====
@app.route('/usuarios')
def usuarios():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nombre FROM roles")
            roles = cursor.fetchall()

    avatar_url = session.get('avatar_url')  # <- Obtener la URL del avatar si existe
    return render_template('usuarios.html', roles=roles, avatar_url=avatar_url)

@app.route('/guardar_usuario', methods=['POST'])
def guardar_usuario():
    nombre = request.form['nombre']
    correo = request.form['correo']
    id_rol = request.form['id_rol'] 
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = "INSERT INTO usuarios (nombre, correo, id_rol) VALUES (%s, %s, %s)"
            cursor.execute(sql, (nombre, correo, id_rol))
        connection.commit()
    return redirect('/')

# ==== PERMISOS ====
@app.route('/permisos')
def mostrar_permisos():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nombre FROM roles")
            roles = cursor.fetchall()

            cursor.execute("SELECT * FROM permisos")
            permisos = cursor.fetchall()

            cursor.execute("SHOW TABLES")
            tablas_raw = cursor.fetchall()
            tablas = [list(t.values())[0] for t in tablas_raw]
    
    return render_template('permisos.html', permisos=permisos, roles=roles, tablas=tablas)

@app.route('/guardar_permisos', methods=['POST'])
def guardar_permisos():
    id_rol = request.form['id_rol']
    tabla = request.form['tabla']
    puede_ver = 'puede_ver' in request.form
    puede_agregar = 'puede_agregar' in request.form
    puede_modificar = 'puede_modificar' in request.form
    puede_eliminar = 'puede_eliminar' in request.form

    print("Procesando:", id_rol, tabla, puede_ver, puede_agregar, puede_modificar, puede_eliminar)

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO permisos (id_rol, tabla, puede_ver, puede_agregar, puede_modificar, puede_eliminar)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    puede_ver = VALUES(puede_ver),
                    puede_agregar = VALUES(puede_agregar),
                    puede_modificar = VALUES(puede_modificar),
                    puede_eliminar = VALUES(puede_eliminar)
            """, (id_rol, tabla, puede_ver, puede_agregar, puede_modificar, puede_eliminar))
        connection.commit()
    return redirect('/permisos')


# ==== MENÚ ====
@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/guardar_menu', methods=['POST'])
def guardar_menu():
    nombre = request.form['nombre']
    descripcion = request.form['descripcion']
    precio = request.form['precio']
    disponible = request.form['disponible']
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = "INSERT INTO menu (nombre, descripcion, precio, disponible) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (nombre, descripcion, precio, disponible))
        connection.commit()
    return redirect('/')

# ==== INGREDIENTES ====
@app.route('/ingredientes')
def ingredientes():
    return render_template('ingredientes.html')

@app.route('/guardar_ingrediente', methods=['POST'])
def guardar_ingrediente():
    nombre = request.form['nombre']
    cantidad = request.form['cantidad']
    unidad = request.form['unidad']
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = "INSERT INTO ingredientes (nombre, cantidad_disponible, unidad_medida) VALUES (%s, %s, %s)"
            cursor.execute(sql, (nombre, cantidad, unidad))
        connection.commit()
    return redirect('/')

# ==== PEDIDOS ====
@app.route('/pedidos')
def pedidos():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nombre FROM usuarios")
            usuarios = cursor.fetchall()
    return render_template('pedidos.html', usuarios=usuarios)

@app.route('/guardar_pedido', methods=['POST'])
def guardar_pedido():
    id_usuario = request.form['id_usuario']
    estado = request.form['estado']
    origen = request.form['origen']
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            # Validar ID de usuario
            cursor.execute("SELECT id FROM usuarios WHERE id = %s", (id_usuario,))
            if not cursor.fetchone():
                return "Error: ID de usuario no válido"

            sql = "INSERT INTO pedidos (id_usuario, estado, origen) VALUES (%s, %s, %s)"
            cursor.execute(sql, (id_usuario, estado, origen))
        connection.commit()
    return redirect('/')

# ==== DETALLE DE PEDIDO ====
@app.route('/detalle_pedido')
def detalle_pedido():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, id_usuario FROM pedidos")
            pedidos = cursor.fetchall()
            cursor.execute("SELECT id, nombre FROM menu WHERE disponible = TRUE")
            menu = cursor.fetchall()
    return render_template('detalle_pedido.html', pedidos=pedidos, menu=menu)

@app.route('/guardar_detalles_pedido', methods=['POST'])
def guardar_detalles_pedido():
    id_pedido = request.form['id_pedido']
    ids_menu = request.form.getlist('id_menu[]')   # lista de menus
    cantidades = request.form.getlist('cantidad[]') # lista de cantidades

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            for id_menu, cantidad in zip(ids_menu, cantidades):
                # Validar si quieres o no aquí
                cursor.execute("""
                    INSERT INTO detalle_pedido (id_pedido, id_menu, cantidad)
                    VALUES (%s, %s, %s)
                """, (id_pedido, id_menu, cantidad))
        connection.commit()

    return redirect('/detalle_pedido')


# ==== REGISTRO DE VOZ ====
@app.route('/registro_voz')
def registro_voz():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM pedidos")
            pedidos = cursor.fetchall()
    return render_template('registro_voz.html', pedidos=pedidos)

@app.route('/guardar_registro_voz', methods=['POST'])
def guardar_registro_voz():
    id_pedido = request.form['id_pedido']
    texto = request.form['texto']
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM pedidos WHERE id = %s", (id_pedido,))
            if not cursor.fetchone():
                return "Error: ID de pedido no válido"
            
            sql = "INSERT INTO registro_voz (id_pedido, texto_reconocido) VALUES (%s, %s)"
            cursor.execute(sql, (id_pedido, texto))
        connection.commit()
    return redirect('/registro_voz')

# ==== AUDITORÍA ====
@app.route('/auditoria')
def auditoria():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT u.id, u.nombre, r.nombre AS rol
                FROM usuarios u
                JOIN roles r ON u.id_rol = r.id
            """)
            usuarios = cursor.fetchall()

            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'sistema'
            """)
            tablas = [row['table_name'] for row in cursor.fetchall()]

            cursor.execute("SELECT id, nombre FROM roles")
            roles = cursor.fetchall()
    
    return render_template('auditoria.html', usuarios=usuarios, tablas=tablas, roles=roles)

@app.route('/guardar_auditoria', methods=['POST'])
def guardar_auditoria():
    id_usuario = request.form['id_usuario']
    rol = request.form['rol']
    tabla = request.form['tabla']
    accion = request.form['accion']
    descripcion = request.form['descripcion']
    dispositivo = request.form['dispositivo']
    ip = request.form['ip']
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM usuarios WHERE id = %s", (id_usuario,))
            if not cursor.fetchone():
                return "Error: ID de usuario no válido"
            
            sql = """
                INSERT INTO auditoria_acciones
                (id_usuario, rol_usuario, tabla_afectada, accion, descripcion, dispositivo, ip_origen)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (id_usuario, rol, tabla, accion, descripcion, dispositivo, ip))
        connection.commit()
    return redirect('/auditoria')

@app.route('/avatar')
def gestionar_avatar():
    return render_template('avatar.html')

# ==== INICIAR APP ====
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
