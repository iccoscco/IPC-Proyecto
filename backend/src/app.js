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

// Rutas
const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/', usuariosRoutes); // <-- conecta la ruta /usuarios

module.exports = app;
