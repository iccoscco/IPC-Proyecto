const express = require('express');
const getConnection = require('./config/db');

const app = express();

app.get('/db', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT 1 + 1 AS resultado');
    res.send(`✅ Conexión exitosa. Resultado: ${rows[0].resultado}`);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    res.status(500).send('❌ Error al conectar a la base de datos');
  }
});

module.exports = app;
