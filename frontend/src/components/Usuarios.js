import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AgregarUsuario() { 
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    correo: '', 
    id_rol: '' 
  });
  const [usuarioId, setUsuarioId] = useState(null);
  const [avatarSvg, setAvatarSvg] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesRes, userRes] = await Promise.all([
          axios.get('/api/roles'),
          axios.get('/api/usuario_actual'), 
        ]);

        setRoles(rolesRes.data);
        setUsuarioId(userRes.data.id);
        setAvatarSvg(userRes.data.avatar_svg);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    }

    fetchData();
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/guardar_usuario', formData);
      alert('Usuario guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el usuario');
    }
  };

  return (
    <div className="form-container">
      <h1>Nuevo Usuario</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required onChange={handleChange} />

        <label htmlFor="correo">Correo:</label>
        <input type="email" id="correo" name="correo" required onChange={handleChange} />

        <label htmlFor="rol">Rol:</label>
        <select id="rol" name="id_rol" required onChange={handleChange}>
          <option value="">-- Selecciona un rol --</option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default AgregarUsuario;
