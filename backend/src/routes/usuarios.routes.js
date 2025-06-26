const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /usuarios -> lista de roles
router.get('/usuarios', async (req, res) => {
  try {
    const connection = await getConnection();
    const [usuarios] = await connection.execute("SELECT id, nombre FROM usuarios");

    res.json({ usuarios }); // Enviamos JSON
  } catch (error) {
    console.error('Error en /usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// POST /guardar_usuario
router.post('/guardar_usuario', async (req, res) => {
    console.log('↪POST /guardar_usuario recibido');
  const { nombre, correo, id_rol } = req.body;

  if (!nombre || !correo || !id_rol) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO usuarios (nombre, correo, id_rol)
       VALUES (?, ?, ?)`,
      [nombre, correo, id_rol]
    );

    res.status(201).json({ message: 'Usuario guardado correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'El correo ya está registrado' });
    } else {    
      console.error('Error al guardar usuario:', error.message);
      res.status(500).json({ error: 'Error al guardar el usuario' });
    }
  }
});

module.exports = router;
