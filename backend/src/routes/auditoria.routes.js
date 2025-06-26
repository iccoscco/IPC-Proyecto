const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /auditoria - Obtener usuarios, roles y tablas
router.get('/auditoria', async (req, res) => {
  try {
    const connection = await getConnection();

    const [usuarios] = await connection.execute(`
      SELECT u.id, u.nombre, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id
    `);

    const [tablas] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME]);

    const [roles] = await connection.execute("SELECT id, nombre FROM roles");

    res.json({
      usuarios,
      tablas: tablas.map(t => t.table_name),
      roles
    });
  } catch (error) {
    console.error('Error en GET /auditoria:', error.message);
    res.status(500).json({ error: 'Error al obtener auditoría' });
  }
});

// POST /guardar_auditoria - Registrar acción
router.post('/guardar_auditoria', async (req, res) => {
  const { id_usuario, rol, tabla, accion, descripcion, dispositivo, ip } = req.body;

  if (!id_usuario || !rol || !tabla || !accion || !descripcion || !dispositivo || !ip) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const connection = await getConnection();

    // Validar usuario
    const [usuarioExiste] = await connection.execute(
      'SELECT id FROM usuarios WHERE id = ?',
      [id_usuario]
    );

    if (usuarioExiste.length === 0) {
      return res.status(404).json({ error: 'ID de usuario no válido' });
    }

    // Insertar auditoría
    await connection.execute(`
      INSERT INTO auditoria_acciones
      (id_usuario, rol_usuario, tabla_afectada, accion, descripcion, dispositivo, ip_origen)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id_usuario, rol, tabla, accion, descripcion, dispositivo, ip]);

    res.status(201).json({ message: 'Auditoría registrada correctamente' });
  } catch (error) {
    console.error('Error en POST /guardar_auditoria:', error.message);
    res.status(500).json({ error: 'Error al guardar auditoría' });
  }
});

module.exports = router;
