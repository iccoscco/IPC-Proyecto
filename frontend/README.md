# Frontend React - IPC-Proyecto

Este frontend fue creado con [Create React App](https://github.com/facebook/create-react-app) y forma parte del sistema de gestión para un restaurante, en conjunto con un backend en Flask.

## Descripción

Permite la administración de usuarios, permisos, menú, ingredientes, pedidos, detalles de pedido, registros de voz y auditoría de acciones. Consume una API REST desarrollada en Flask.

## Estructura del Proyecto
frontend/ 
│ 
├── src/ 
│ 
├── components/ # Componentes principales (Usuarios, Permisos,etc.) 
│ 
├── widgets/ # Componentes reutilizables (Sidebar, etc.) 
│ 
├── App.js # Layout base 
│   └── ...
├── public/ 
├── package.json 
└── README.md
## Instalación y Uso

1. Instala las dependencias:
    ```bash
    npm install
2. Inicia el servidor de desarrollo:
    ```bash
    npm start
    Abre http://localhost:3000 para ver la app en tu navegador.

Asegúrate de que el backend Flask esté corriendo y acepte peticiones desde este frontend (CORS habilitado).
## Principales Librerías Usadas
    react-router-dom: Navegación entre páginas.
    axios: Consumo de la API Flask.
## Componentes Principales
1. Sidebar: Navegación lateral con enlaces a todas las secciones.
2. Usuarios, Permisos, Menú, Ingredientes, Pedidos, Detalles, Registros de Voz, Auditoría: Cada uno como componente React, mostrando tablas y formularios según los datos recibidos del backend.