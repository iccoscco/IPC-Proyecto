// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Usuarios from './components/Usuarios';
import Permisos from './components/Permisos';
import Menu from './components/Menu';
import Ingredientes from './components/Ingredientes';
import Pedidos from './components/Pedidos';
import DetallePedido from './components/DetallePedido';
import RegistroVoz from './components/RegistroVoz';
import Auditoria from './components/Auditoria';
import Index from './components/Index';
import Avatar from './components/Avatar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App>
      <Routes>
        <Route path="/index" element={<Index />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/permisos" element={<Permisos />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/ingredientes" element={<Ingredientes />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/detalle_pedido" element={<DetallePedido />} />
        <Route path="/registro_voz" element={<RegistroVoz />} />
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/avatar" element={<Avatar />} />
        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </App>
  </BrowserRouter>
);