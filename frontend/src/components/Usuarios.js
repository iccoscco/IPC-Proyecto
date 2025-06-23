import React, { useState } from 'react';

function AgregarUsuario() { 
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    correo: '', 
    id_rol: '' 
  });
  const [usuarioId, setUsuarioId] = useState(null);
  const [avatarSvg, setAvatarSvg] = useState('');
  
  return (
    <div className="form-container">
      <h1>Nuevo Usuario</h1>
    </div>
  );
}

export default AgregarUsuario;
