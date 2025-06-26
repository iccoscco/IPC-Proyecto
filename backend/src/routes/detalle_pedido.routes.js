const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');

// GET /detalle_pedido
router.get('/detalle_pedido', async (req, res) => {
  try {
    const connection = await getConnection();

    // Obtener usuarios
    const [usuarios] = await connection.execute("SELECT id, nombre FROM usuarios");

    // Pedidos pendientes
    const [pedidos] = await connection.execute("SELECT id, id_usuario FROM pedidos WHERE estado = 'pendiente'");

    // Menú disponible
    const [menu] = await connection.execute("SELECT id, nombre FROM menu");

    res.json({ usuarios, pedidos, menu });
  } catch (error) {
    console.error('Error en GET /detalle_pedido:', error.message);
    res.status(500).json({ error: 'Error al obtener detalle del pedido' });
  }
});

// POST /guardar_detalles_pedido
router.post('/guardar_detalles_pedido', async (req, res) => {
  const { id_pedido, detalles } = req.body;

  // Validaciones básicas
  if (!id_pedido || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: 'Faltan campos requeridos o lista de detalles inválida' });
  }

  try {
    const connection = await getConnection();

    // Insertar cada detalle
    for (const detalle of detalles) {
      const { id_menu, cantidad } = detalle;

      if (!id_menu || !cantidad) {
        continue; // saltar si falta info
      }

      await connection.execute(
        `INSERT INTO detalle_pedido (id_pedido, id_menu, cantidad)
         VALUES (?, ?, ?)`,
        [id_pedido, id_menu, cantidad]
      );
    }

    res.status(201).json({ message: 'Detalles del pedido guardados correctamente' });
  } catch (error) {
    console.error('Error en POST /guardar_detalles_pedido:', error.message);
    res.status(500).json({ error: 'Error al guardar detalles del pedido' });
  }
});

module.exports = router;
