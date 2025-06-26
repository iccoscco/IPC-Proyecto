const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'IPC-Grup0',
  resave: false,
  saveUninitialized: true
}));

// Importar rutas
const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/', usuariosRoutes);
const permisosRoutes = require('./routes/permisos.routes');
app.use('/', permisosRoutes); 
const menuRoutes = require('./routes/menu.routes');
app.use('/', menuRoutes);
const ingredientesRoutes = require('./routes/ingredientes.routes');
app.use('/', ingredientesRoutes);
const pedidosRoutes = require('./routes/pedidos.routes');
app.use('/', pedidosRoutes);
const detallePedidoRoutes = require('./routes/detalle_pedido.routes');
app.use('/', detallePedidoRoutes);
const auditoriaRoutes = require('./routes/auditoria.routes');
app.use('/', auditoriaRoutes);
const registroVozRoutes = require('./routes/registro_voz.routes');
app.use('/', registroVozRoutes);

module.exports = app;
