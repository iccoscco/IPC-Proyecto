const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /usuarios -> lista de roles
router.get('/usuarios', async (req, res) => {
  try {
    const connection = await getConnection();
    const [roles] = await connection.execute("SELECT id, nombre FROM roles");

    res.json({ roles }); // Enviamos JSON
  } catch (error) {
    console.error('Error en /usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
