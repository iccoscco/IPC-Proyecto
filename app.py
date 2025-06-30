from flask import Flask, render_template, request, redirect, session, jsonify
from avatar_routes import avatar_bp 
import pymysql
import os
from werkzeug.utils import secure_filename
from pymysql.err import IntegrityError

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'img', 'menu')
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
    return render_template('index.html')

@app.route('/tablas')
def tablas():
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
        'tablas.html',
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
            nuevo_id = cursor.lastrowid
        connection.commit()

    # Guardar en sesión
    session['usuario_id'] = nuevo_id
    session['usuario_nombre'] = nombre

    # Si es un fetch/ajax (cabecera específica), retorna JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True, 'id_usuario': nuevo_id, 'nombre': nombre})
    else:
        # Si es formulario tradicional (táctil), redirige
        return redirect(f'/pedidos?id_usuario={nuevo_id}&origen=tactil')


@app.route('/editar_usuarios')
def editar_usuarios():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            # Obtener usuarios con rol
            cursor.execute("""
                SELECT u.*, r.nombre AS rol_nombre 
                FROM usuarios u 
                JOIN roles r ON u.id_rol = r.id
            """)
            usuarios = cursor.fetchall()

            # Obtener roles
            cursor.execute("SELECT id, nombre FROM roles")
            roles = cursor.fetchall()

            # Verificar relaciones para cada usuario
            usuarios_relacionados = {}
            for usuario in usuarios:
                user_id = usuario['id']
                relacionado = False

                # Verificar en pedidos
                cursor.execute("SELECT COUNT(*) AS total FROM pedidos WHERE id_usuario = %s", (user_id,))
                if cursor.fetchone()['total'] > 0:
                    relacionado = True

                # Verificar en auditoria
                cursor.execute("SELECT COUNT(*) AS total FROM auditoria_acciones WHERE id_usuario = %s", (user_id,))
                if cursor.fetchone()['total'] > 0:
                    relacionado = True

                usuarios_relacionados[user_id] = relacionado

    return render_template(
        'editar_usuarios.html',
        usuarios=usuarios,
        roles=roles,
        usuarios_relacionados=usuarios_relacionados
    )

@app.route('/actualizar_usuario/<int:id>', methods=['POST'])
def actualizar_usuario(id):
    nombre = request.form['nombre']
    correo = request.form['correo']
    id_rol = request.form['id_rol']

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = "UPDATE usuarios SET nombre=%s, correo=%s, id_rol=%s WHERE id=%s"
            cursor.execute(sql, (nombre, correo, id_rol, id))
        connection.commit()

    return redirect('/editar_usuarios')

@app.route('/eliminar_usuario/<int:id>')
def eliminar_usuario(id):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
        connection.commit()

    return redirect('/editar_usuarios')

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

# ==== PEDIDOS ====
@app.route('/pedidos')
def pedidos():
    # Obtener el ID del usuario desde la URL o desde la sesión
    id_usuario = request.args.get('id_usuario')

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nombre FROM usuarios")
            usuarios = cursor.fetchall()

            if id_usuario:
                cursor.execute("SELECT * FROM pedidos WHERE id_usuario = %s", (id_usuario,))
            else:
                cursor.execute("SELECT * FROM pedidos")
            pedidos = cursor.fetchall()

            cursor.execute("SELECT * FROM menu WHERE disponible = 1")
            menu = cursor.fetchall()

    # Obtener avatar SVG desde la sesion si esta disponible
    avatar_svg = session.get('avatar_svg')

    return render_template(
        'pedidos.html',
        usuarios=usuarios,
        pedidos=pedidos,
        usuario_filtrado=id_usuario,
        menu=menu,
        usuario_id=id_usuario,      # para el automata
        avatar_svg=avatar_svg       # para mostrar el avatar
    )


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
                return jsonify({'success': False, 'error': 'ID de usuario no válido'})

            sql = "INSERT INTO pedidos (id_usuario, estado, origen) VALUES (%s, %s, %s)"
            cursor.execute(sql, (id_usuario, estado, origen))
            nuevo_pedido_id = cursor.lastrowid  # Obtener el ID del nuevo pedido
        connection.commit()

    # Si viene desde fetch/ajax
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True, 'id_pedido': nuevo_pedido_id, 'id_usuario': id_usuario})
    else:
        # Redirige al formulario de detalle de pedido con los valores en la URL
        return redirect(f'/detalle_pedido?id_usuario={id_usuario}&id_pedido={nuevo_pedido_id}')

@app.route('/editar_pedidos')
def editar_pedidos():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            # Traer pedidos con nombre del usuario
            cursor.execute("""
                SELECT p.*, u.nombre AS nombre_usuario 
                FROM pedidos p 
                JOIN usuarios u ON p.id_usuario = u.id
            """)
            pedidos = cursor.fetchall()

            # Traer usuarios
            cursor.execute("SELECT id, nombre FROM usuarios")
            usuarios = cursor.fetchall()

            # Traer menú
            cursor.execute("SELECT * FROM menu")
            menu = cursor.fetchall()

            # Traer detalles de pedido
            cursor.execute("SELECT * FROM detalle_pedido")
            detalles = cursor.fetchall()

    # Agrupar detalle por id_pedido
    detalles_por_pedido = {}
    for detalle in detalles:
        detalles_por_pedido.setdefault(detalle['id_pedido'], []).append(detalle)

    # Verificar si un pedido tiene detalles relacionados
    pedidos_relacionados = {}
    for pedido in pedidos:
        id_pedido = pedido['id']
        pedidos_relacionados[id_pedido] = id_pedido in detalles_por_pedido and len(detalles_por_pedido[id_pedido]) > 0

    return render_template(
        'editar_pedidos.html',
        pedidos=pedidos,
        usuarios=usuarios,
        menu=menu,
        detalles_por_pedido=detalles_por_pedido,
        pedidos_relacionados=pedidos_relacionados  
    )


@app.route('/actualizar_pedido/<int:id>', methods=['POST'])
def actualizar_pedido(id):
    id_usuario = request.form['id_usuario']
    estado = request.form['estado']
    origen = request.form['origen']

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = """
                UPDATE pedidos SET id_usuario=%s, estado=%s, origen=%s WHERE id=%s
            """
            cursor.execute(sql, (id_usuario, estado, origen, id))
        connection.commit()
    return redirect('/editar_pedidos')


@app.route('/eliminar_pedido/<int:id>')
def eliminar_pedido(id):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM pedidos WHERE id = %s", (id,))
        connection.commit()
    return redirect('/editar_pedidos')

@app.route('/cancelar_pedido/<int:id>', methods=['POST'])
def cancelar_pedido(id):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        cursor.execute("UPDATE pedidos SET estado = 'cancelado' WHERE id = %s", (id,))
    connection.commit()
    return '', 204

# ==== DETALLE DE PEDIDO ====
@app.route('/detalle_pedido')
def detalle_pedido():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            # Obtener todos los usuarios
            cursor.execute("SELECT id, nombre FROM usuarios")
            usuarios = cursor.fetchall()

            # Obtener todos los pedidos con estado "pendiente"
            cursor.execute("SELECT id, id_usuario FROM pedidos WHERE estado = 'pendiente'")
            pedidos = cursor.fetchall()

            # Obtener menu disponible
            cursor.execute("SELECT id, nombre, descripcion, precio, imagen_url FROM menu WHERE disponible = 1")
            menu = cursor.fetchall()

    return render_template('detalle_pedido.html', usuarios=usuarios, menu=menu, pedidos=pedidos)



@app.route('/guardar_detalles_pedido', methods=['POST'])
def guardar_detalles_pedido():
    id_pedido = request.form['id_pedido']
    ids_menu = request.form.getlist('id_menu[]')   # lista de menus
    cantidades = request.form.getlist('cantidad[]') # lista de cantidades

    print("🗂️ Recibiendo detalle pedido:")
    print("id_pedido:", id_pedido)
    print("ids_menu:", ids_menu)
    print("cantidades:", cantidades)

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            for id_menu, cantidad in zip(ids_menu, cantidades):
        
                cursor.execute("""
                    INSERT INTO detalle_pedido (id_pedido, id_menu, cantidad)
                    VALUES (%s, %s, %s)
                """, (id_pedido, id_menu, cantidad))
        connection.commit()

    return redirect(request.referrer)

@app.route('/actualizar_detalle_pedido/<int:id>', methods=['POST'])
def actualizar_detalle_pedido(id):
    id_menu = request.form['id_menu']
    cantidad = request.form['cantidad']

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = """
                UPDATE detalle_pedido 
                SET id_menu=%s, cantidad=%s 
                WHERE id=%s
            """
            cursor.execute(sql, (id_menu, cantidad, id))
        connection.commit()
    return redirect('/editar_pedidos')

@app.route('/eliminar_detalle_pedido/<int:id>')
def eliminar_detalle_pedido(id):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM detalle_pedido WHERE id = %s", (id,))
        connection.commit()
    return redirect(request.referrer or '/editar_pedidos')


@app.route('/pedidos_usuario/<int:id_usuario>')
def pedidos_usuario_json(id_usuario):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id FROM pedidos 
                WHERE id_usuario = %s AND estado = 'pendiente'
            """, (id_usuario,))
            pedidos = cursor.fetchall()

    return jsonify({ 'pedidos': pedidos })

@app.route('/vista_pedido')
def vista_pedido():
    id_usuario = request.args.get('id_usuario')

    if not id_usuario:
        return "ID de usuario no proporcionado", 400

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            # Obtener nombre del usuario
            cursor.execute("SELECT nombre FROM usuarios WHERE id = %s", (id_usuario,))
            usuario = cursor.fetchone()

            # Obtener pedidos del usuario
            cursor.execute("""
                SELECT p.id, p.estado, p.fecha
                FROM pedidos p
                WHERE p.id_usuario = %s
            """, (id_usuario,))
            pedidos = cursor.fetchall()

            # Obtener detalles de cada pedido
            cursor.execute("""
                SELECT dp.id_pedido, dp.id_menu, m.nombre AS nombre_menu, m.descripcion, m.precio, dp.cantidad
                FROM detalle_pedido dp
                JOIN menu m ON dp.id_menu = m.id
                JOIN pedidos p ON dp.id_pedido = p.id
                WHERE p.id_usuario = %s
            """, (id_usuario,))
            detalles = cursor.fetchall()

            # Obtener menu
            cursor.execute("SELECT * FROM menu WHERE disponible = 1")
            menu = cursor.fetchall()

    # Calcular total por pedido en backend
    totales_por_pedido = {}
    for pedido in pedidos:
        total = 0
        for item in detalles:
            if item['id_pedido'] == pedido['id']:
                total += item['precio'] * item['cantidad']
        totales_por_pedido[pedido['id']] = total

    return render_template('vista_pedido.html', usuario=usuario, pedidos=pedidos, detalles=detalles, totales_por_pedido=totales_por_pedido, menu=menu)

@app.route('/vista_pedido/eliminar_item/<int:id_pedido>/<int:id_menu>', methods=['POST'])
def eliminar_item_vista_pedido(id_pedido, id_menu):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM detalle_pedido WHERE id_pedido = %s AND id_menu = %s",
                (id_pedido, id_menu)
            )
        connection.commit()
    return redirect(request.referrer or '/vista_pedido')


@app.route('/pedidos_por_usuario')
def pedidos_por_usuario():
    usuario_id = request.args.get('usuario_id')

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM pedidos WHERE estado = 'pendiente' AND id_usuario = %s", (usuario_id,))
            pedidos = cursor.fetchall()
    
    return jsonify(pedidos)

@app.route('/actualizar_estado', methods=['POST'])
def actualizar_estado():
    data = request.get_json()
    id_pedido = data['id_pedido']
    nuevo_estado = data['nuevo_estado']

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("UPDATE pedidos SET estado = %s WHERE id = %s", (nuevo_estado, id_pedido))
        connection.commit()
    return jsonify({'success': True})

@app.route('/vista_cocinero')
def vista_cocinero():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            # Obtener todos los pedidos
            cursor.execute("SELECT * FROM pedidos")
            pedidos = cursor.fetchall()

            # Obtener detalles de cada pedido (menu + cantidad)
            cursor.execute("""
                SELECT dp.id_pedido, dp.id_menu, m.nombre AS nombre_menu, dp.cantidad
                FROM detalle_pedido dp
                JOIN menu m ON dp.id_menu = m.id
            """)
            detalles = cursor.fetchall()

            # Obtener ingredientes por menú
            cursor.execute("""
                SELECT 
                    mi.id_menu, 
                    i.nombre AS nombre_ingrediente, 
                    mi.cantidad_necesaria AS cantidad, 
                    i.unidad_medida
                FROM menu_ingredientes mi
                JOIN ingredientes i ON mi.id_ingrediente = i.id
            """)
            ingredientes_por_menu = cursor.fetchall()

    return render_template(
        'vista_cocinero.html',
        pedidos=pedidos,
        detalles=detalles,
        ingredientes_por_menu=ingredientes_por_menu
    )

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

    imagen = request.files.get('imagen')
    imagen_url = None

    if imagen and imagen.filename != '':
        filename = secure_filename(imagen.filename)
        ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        imagen.save(ruta)
        imagen_url = f"/static/img/menu/{filename}"
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = "INSERT INTO menu (nombre, descripcion, precio, disponible, imagen_url) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (nombre, descripcion, precio, disponible, imagen_url))
        connection.commit()
    return redirect('/')

@app.route('/editar_menu')
def editar_menu():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM menu")
            menu = cursor.fetchall()
    return render_template('editar_menu.html', menu=menu)

@app.route('/actualizar_menu/<int:id>', methods=['POST'])
def actualizar_menu(id):
    nombre = request.form['nombre']
    descripcion = request.form['descripcion']
    precio = request.form['precio']
    disponible = request.form['disponible']

    imagen = request.files.get('imagen')
    imagen_url = None

    if imagen and imagen.filename != '':
        filename = secure_filename(imagen.filename)
        ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        imagen.save(ruta)
        imagen_url = f"/static/img/menu/{filename}"

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            if imagen_url:
                sql = """
                    UPDATE menu SET nombre=%s, descripcion=%s, precio=%s, disponible=%s, imagen_url=%s WHERE id=%s
                """
                cursor.execute(sql, (nombre, descripcion, precio, disponible, imagen_url, id))
            else:
                sql = """
                    UPDATE menu SET nombre=%s, descripcion=%s, precio=%s, disponible=%s WHERE id=%s
                """
                cursor.execute(sql, (nombre, descripcion, precio, disponible, id))
        connection.commit()
    return redirect('/editar_menu')


@app.route('/eliminar_menu/<int:id>')
def eliminar_menu(id):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM menu WHERE id = %s", (id,))
        connection.commit()
    return redirect('/editar_menu')


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

@app.route('/editar_ingredientes')
def editar_ingredientes():
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM ingredientes")
            ingredientes = cursor.fetchall()
    return render_template('editar_ingredientes.html', ingredientes=ingredientes)


@app.route('/actualizar_ingrediente/<int:id>', methods=['POST'])
def actualizar_ingrediente(id):
    nombre = request.form['nombre']
    cantidad = request.form['cantidad']
    unidad = request.form['unidad']
    
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql = """
                UPDATE ingredientes 
                SET nombre=%s, cantidad_disponible=%s, unidad_medida=%s 
                WHERE id=%s
            """
            cursor.execute(sql, (nombre, cantidad, unidad, id))
        connection.commit()
    return redirect('/editar_ingredientes')


@app.route('/eliminar_ingrediente/<int:id>')
def eliminar_ingrediente(id):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM ingredientes WHERE id = %s", (id,))
        connection.commit()
    return redirect('/editar_ingredientes')

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
    rol_usuario = request.form['rol_usuario']  # Cambiar para que coincida con HTML
    tabla = request.form['tabla']
    accion = request.form['accion']
    descripcion = request.form['descripcion']

    # Capturar desde headers y request
    dispositivo = request.headers.get('User-Agent')
    ip = request.remote_addr

    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM usuarios WHERE id = %s", (id_usuario,))
            if not cursor.fetchone():
                return "Error: ID de usuario no válido"
            
            cursor.execute("""
                INSERT INTO auditoria_acciones
                (id_usuario, rol_usuario, tabla_afectada, accion, descripcion, dispositivo, ip_origen)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (id_usuario, rol_usuario, tabla, accion, descripcion, dispositivo, ip))
        connection.commit()
    return redirect('/auditoria')

@app.route('/avatar')
def gestionar_avatar():
    return render_template('avatar.html')

# ==== INICIAR APP ====
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
