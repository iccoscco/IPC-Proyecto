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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Nuevo Usuario</h1>
        <Link
          to="/index"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={e => (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={e => (e.target.style.backgroundColor = '#007BFF')}
        >
          🏠 Volver al inicio
        </Link>
      </div>
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

      <input type="hidden" id="usuario_id" value={usuarioId || ''} />

      <div style={{ marginTop: 20 }}>
        <h3>Avatar actual:</h3>
        <div id="avatar-container">
          {avatarSvg ? (
            <div dangerouslySetInnerHTML={{ __html: avatarSvg }} />
          ) : (
            <p>No hay avatar disponible.</p>
          )}
        </div>
      </div>

      <div id="ui" style={{ marginBottom: 10 }}>
        <button type="button" onClick={() => window.iniciarAutomata?.()}>
          🗣 Iniciar registro por voz
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: 10 }}>
          <h3>🗣️ Conversación</h3>
          <div id="chat" style={{ height: 300, overflowY: 'auto' }}></div>
        </div>
        <div style={{ flex: 1, border: '1px solid #aaa', padding: 10, backgroundColor: '#f9f9f9' }}>
          <h3>🧪 Depuración</h3>
          <div id="debug" style={{ height: 300, overflowY: 'auto', fontSize: '0.9em', color: '#333' }}></div>
        </div>
      </div>
    </div>
  );
}

export default AgregarUsuario;
