const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

router.get('/permisos', async (req, res) => {
  try {
    const connection = await getConnection();

    // Obtener roles
    const [roles] = await connection.execute("SELECT id, nombre FROM roles");

    // Obtener permisos
    const [permisos] = await connection.execute("SELECT * FROM permisos");

    // Obtener nombres de tablas
    const [tablasRaw] = await connection.execute("SHOW TABLES");
    const tablas = tablasRaw.map(row => Object.values(row)[0]); // Extraer nombres

    res.json({ roles, permisos, tablas });
  } catch (error) {
    console.error('Error en GET /permisos:', error.message);
    res.status(500).json({ error: 'Error al obtener los permisos' });
  }
});

// POST /guardar_permiso
router.post('/guardar_permisos', async (req, res) => {
  const { id_rol, tabla, puede_ver, puede_agregar, puede_modificar, puede_eliminar } = req.body;

  if (!id_rol || !tabla) {
    return res.status(400).json({ error: 'Faltan datos requeridos (id_rol o tabla)' });
  }

  try {
    const connection = await getConnection();

    await connection.execute(`
      INSERT INTO permisos (id_rol, tabla, puede_ver, puede_agregar, puede_modificar, puede_eliminar)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        puede_ver = VALUES(puede_ver),
        puede_agregar = VALUES(puede_agregar),
        puede_modificar = VALUES(puede_modificar),
        puede_eliminar = VALUES(puede_eliminar)
    `, [
      id_rol,
      tabla,
      !!puede_ver,        // Convertir a booleano (true/false)
      !!puede_agregar,
      !!puede_modificar,
      !!puede_eliminar
    ]);

    res.status(201).json({ message: 'Permisos guardados correctamente' });
  } catch (error) {
    console.error('Error en POST /guardar_permisos:', error.message);
    res.status(500).json({ error: 'Error al guardar permisos' });
  }
});


module.exports = router;
