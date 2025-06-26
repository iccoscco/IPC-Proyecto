const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /registro_voz - Obtener todos los pedidos
router.get('/registro_voz', async (req, res) => {
  try {
    const connection = await getConnection();
    const [pedidos] = await connection.execute("SELECT id FROM pedidos");

    res.json({ pedidos });
  } catch (error) {
    console.error('Error en GET /registro_voz:', error.message);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// POST /guardar_registro_voz
router.post('/guardar_registro_voz', async (req, res) => {
  const { id_pedido, texto } = req.body;

  if (!id_pedido || !texto) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const connection = await getConnection();

    // Verificar si el pedido existe
    const [pedido] = await connection.execute(
      "SELECT id FROM pedidos WHERE id = ?",
      [id_pedido]
    );

    if (pedido.length === 0) {
      return res.status(404).json({ error: 'ID de pedido no válido' });
    }

    // Insertar texto reconocido
    await connection.execute(
      `INSERT INTO registro_voz (id_pedido, texto_reconocido)
       VALUES (?, ?)`,
      [id_pedido, texto]
    );

    res.status(201).json({ message: 'Registro de voz guardado correctamente' });
  } catch (error) {
    console.error('Error en POST /guardar_registro_voz:', error.message);
    res.status(500).json({ error: 'Error al guardar el registro de voz' });
  }
});

module.exports = router;
