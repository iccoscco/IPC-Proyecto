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

  return (
    <div className="form-container">
      <h1>Nuevo Usuario</h1>
    </div>
  );
}

export default AgregarUsuario;
