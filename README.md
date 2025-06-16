# IPC-Proyecto

Proyecto del curso Ingeniería y Procesos Software

## Descripción

Este proyecto es un sistema para la gestión de un restaurante, desarrollado con un backend en **Flask** (Python) y un frontend moderno en **React**. Permite la administración de usuarios, permisos, menú, ingredientes, pedidos, detalles de pedido, registros de voz y auditoría de acciones.

## Estructura del Proyecto
IPC-Proyecto/  
│  
├── app.py # Backend Flask  
├── requirements.txt # Dependencias Python  
├── .env # Variables de entorno (conexión BD)  
├── templates/ # (Migrado a React) Plantillas antiguas  
├── static/ # Archivos estáticos (CSS, imágenes)  
└── frontend/ # Frontend React

## Instalación

### 1. Clona el repositorio
```bash
git clone https://github.com/iccoscco/IPC-Proyecto.git
cd IPC-Proyecto
```
### 2. Configura el backend
Instala dependencias:
```bash
pip install -r requirements.txt
```
Crea un archivo .env con tus datos de conexión:
```bash
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=nombre_base
```
Ejecuta el backend:
```bash
python app.py
```
3. Configura el frontend
```bash
cd frontend
npm install
npm start
```

