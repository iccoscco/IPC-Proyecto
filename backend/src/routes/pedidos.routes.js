const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /pedidos?usuario_id=1 - Obtener pedidos (todos o por usuario)
router.get('/pedidos', async (req, res) => {
  const id_usuario = req.query.usuario_id;

  try {
    const connection = await getConnection();

    let pedidos;
    if (id_usuario) {
      const [result] = await connection.execute(
        'SELECT * FROM pedidos WHERE id_usuario = ?',
        [id_usuario]
      );
      pedidos = result;
    } else {
      const [result] = await connection.execute('SELECT * FROM pedidos');
      pedidos = result;
    }

    res.json({ pedidos });
  } catch (error) {
    console.error('Error en GET /pedidos:', error.message);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// POST /guardar_pedido - Agregar nuevo pedido
router.post('/guardar_pedido', async (req, res) => {
  const { id_usuario, estado, origen } = req.body;

  if (!id_usuario || !estado || !origen) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const connection = await getConnection();

    // Validar que el usuario exista
    const [usuarioExiste] = await connection.execute(
      'SELECT id FROM usuarios WHERE id = ?',
      [id_usuario]
    );

    if (usuarioExiste.length === 0) {
      return res.status(404).json({ error: 'ID de usuario no válido' });
    }

    await connection.execute(
      `INSERT INTO pedidos (id_usuario, estado, origen)
       VALUES (?, ?, ?)`,
      [id_usuario, estado, origen]
    );

    res.status(201).json({ message: 'Pedido guardado correctamente' });
  } catch (error) {
    console.error('Error en POST /guardar_pedido:', error.message);
    res.status(500).json({ error: 'Error al guardar pedido' });
  }
});

module.exports = router;
