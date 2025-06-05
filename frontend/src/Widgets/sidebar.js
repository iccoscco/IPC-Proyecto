import React from 'react';

function Sidebar() {
  return (
    <aside id="sidebar" className="sidebar">
        <a href="/usuarios">Usuarios</a>
        <a href="/permisos">Permisos</a>
        <a href="/menu">Menú</a>
        <a href="/ingredientes">Ingredientes</a>
        <a href="/pedidos">Pedidos</a>
        <a href="/detalle_pedido">Detalle Pedido</a>
        <a href="/registro_voz">Registro Voz</a>
        <a href="/auditoria">Auditoría</a>
        <a href="/avatar">Avatar</a>
    </aside>
  );
}

export default Sidebar;