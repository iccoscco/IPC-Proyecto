const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /ingredientes - Lista de ingredientes
router.get('/ingredientes', async (req, res) => {
  try {
    const connection = await getConnection();
    const [ingredientes] = await connection.execute("SELECT * FROM ingredientes");

    res.json({ ingredientes });
  } catch (error) {
    console.error('Error en GET /ingredientes:', error.message);
    res.status(500).json({ error: 'Error al obtener ingredientes' });
  }
});

// POST /guardar_ingrediente - Agregar nuevo ingrediente
router.post('/guardar_ingrediente', async (req, res) => {
  const { nombre, cantidad, unidad } = req.body;

  if (!nombre || !cantidad || !unidad) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO ingredientes (nombre, cantidad_disponible, unidad_medida)
       VALUES (?, ?, ?)`,
      [nombre, cantidad, unidad]
    );

    res.status(201).json({ message: 'Ingrediente agregado correctamente' });
  } catch (error) {
    console.error('Error en POST /guardar_ingrediente:', error.message);
    res.status(500).json({ error: 'Error al guardar ingrediente' });
  }
});

module.exports = router;
