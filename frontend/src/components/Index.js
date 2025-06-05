import React from 'react';

function Index({
  usuarios = [],
  permisos = [],
  menu = [],
  ingredientes = [],
  pedidos = [],
  detalles = [],
  registros_voz = [],
  auditorias = [],
}) {
  return (
    <div>
      <h1>Bienvenido al Sistema del Restaurante</h1>
      <p>Resumen de datos actuales en el sistema:</p>

      <h2>Usuarios</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.id_rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Permisos</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rol</th>
              <th>Tabla</th>
              <th>Puede Ver</th>
              <th>Puede Agregar</th>
              <th>Puede Modificar</th>
              <th>Puede Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {permisos.map(permiso => (
              <tr key={permiso.id}>
                <td>{permiso.id}</td>
                <td>{permiso.nombre_rol}</td>
                <td>{permiso.tabla}</td>
                <td>{permiso.puede_ver ? '✔️' : '❌'}</td>
                <td>{permiso.puede_agregar ? '✔️' : '❌'}</td>
                <td>{permiso.puede_modificar ? '✔️' : '❌'}</td>
                <td>{permiso.puede_eliminar ? '✔️' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Menú</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            {menu.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nombre}</td>
                <td>{item.descripcion}</td>
                <td>{item.precio}</td>
                <td>{item.disponible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Ingredientes</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Cantidad</th><th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map(ing => (
              <tr key={ing.id}>
                <td>{ing.id}</td>
                <td>{ing.nombre}</td>
                <td>{ing.cantidad_disponible}</td>
                <td>{ing.unidad_medida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Pedidos</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th><th>ID Usuario</th><th>Estado</th><th>Origen</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(ped => (
              <tr key={ped.id}>
                <td>{ped.id}</td>
                <td>{ped.id_usuario}</td>
                <td>{ped.estado}</td>
                <td>{ped.origen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Detalles de Pedido</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th><th>ID Pedido</th><th>ID Menú</th><th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.id_pedido}</td>
                <td>{d.id_menu}</td>
                <td>{d.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Registros de Voz</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th><th>ID Pedido</th><th>Texto</th>
            </tr>
          </thead>
          <tbody>
            {registros_voz.map(rv => (
              <tr key={rv.id}>
                <td>{rv.id}</td>
                <td>{rv.id_pedido}</td>
                <td>{rv.texto_reconocido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Auditoría</h2>
      <div className="table-responsive">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th><th>ID Usuario</th><th>Rol</th><th>Tabla</th><th>Acción</th><th>Descripción</th><th>Dispositivo</th><th>IP</th>
            </tr>
          </thead>
          <tbody>
            {auditorias.map(aud => (
              <tr key={aud.id}>
                <td>{aud.id}</td>
                <td>{aud.id_usuario}</td>
                <td>{aud.rol_usuario}</td>
                <td>{aud.tabla_afectada}</td>
                <td>{aud.accion}</td>
                <td>{aud.descripcion}</td>
                <td>{aud.dispositivo}</td>
                <td>{aud.ip_origen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Index;