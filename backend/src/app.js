const express = require('express');

const app = express();

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente ✅');
});

module.exports = app;
