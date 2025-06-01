from flask import Blueprint, render_template, request, session, url_for, jsonify
import os
from datetime import datetime

# Define un Blueprint
avatar_bp = Blueprint('avatar', __name__)

# Ruta para mostrar el editor de avatar
@avatar_bp.route('/avatar')
def gestionar_avatar():
    usuario_id = session.get('usuario_id')  # <- Toma el ID guardado
    return render_template('avatar.html', usuario_id=usuario_id)

@avatar_bp.route('/guardar_avatar_svg', methods=['POST'])
def guardar_avatar_svg():
    data = request.get_json()
    svg_code = data.get('svg')
    usuario_id = data.get('usuario_id')  # ✅ ahora recibimos el ID

    if not svg_code or not usuario_id:
        return 'Faltó el contenido del avatar SVG o el ID del usuario', 400

    # Crear una carpeta para avatares dentro de static
    avatar_dir = os.path.join('static', 'avatars')
    os.makedirs(avatar_dir, exist_ok=True)

    # Crear nombre de archivo con ID de usuario
    filename = "avatar.svg"
    filepath = os.path.join(avatar_dir, filename)

    # Guardar el SVG en un archivo
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_code)

    # Guardar la URL en la sesión si quieres reutilizarla después
    avatar_url = url_for('static', filename=f'avatars/{filename}')
    session['avatar_url'] = avatar_url

    return jsonify({'mensaje': 'Avatar guardado', 'url': avatar_url, 'usuario_id': usuario_id})
