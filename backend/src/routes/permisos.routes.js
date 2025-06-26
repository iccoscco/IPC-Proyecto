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

module.exports = router;
