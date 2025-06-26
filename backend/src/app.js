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

module.exports = app;
