const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /menu - Listar platos
router.get('/menu', async (req, res) => {
  try {
    const connection = await getConnection();
    const [menu] = await connection.execute("SELECT * FROM menu");

    res.json({ menu });
  } catch (error) {
    console.error('Error en GET /menu:', error.message);
    res.status(500).json({ error: 'Error al obtener el menú' });
  }
});

// POST /guardar_menu - Agregar nuevo plato
router.post('/guardar_menu', async (req, res) => {
  const { nombre, descripcion, precio, disponible } = req.body;

  if (!nombre || !descripcion || !precio || disponible === undefined) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO menu (nombre, descripcion, precio, disponible)
       VALUES (?, ?, ?, ?)`,
      [nombre, descripcion, precio, disponible]
    );

    res.status(201).json({ message: 'Plato agregado al menú correctamente' });
  } catch (error) {
    console.error('Error en POST /guardar_menu:', error.message);
    res.status(500).json({ error: 'Error al agregar al menú' });
  }
});

module.exports = router;
