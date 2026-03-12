# 🚀 Sistema de Gestión de Tareas Escolares

Este proyecto es una aplicación web diseñada para ayudar a los estudiantes a organizar sus periodos académicos, materias, horarios y tareas de manera eficiente.

---

## 🛠️ Stack Tecnológico: Backend

Para que un desarrollador externo pueda replicar este proyecto en un equipo diferente, se detallan a continuación las herramientas y librerías fundamentales utilizadas en el servidor:

| Herramienta / Librería | Versión | Descripción |
| :--- | :---: | :--- |
| **Node.js** | `v18.x`+ | Entorno de ejecución para JavaScript en el servidor. |
| **PostgreSQL** | `v15.0` | Sistema de gestión de base de datos relacional. |
| **Express.js** | `^4.18.2` | Framework para la creación de la API REST y manejo de rutas. |
| **pg (node-postgres)** | `^8.11.0` | Cliente para conectar Node.js con la base de datos PostgreSQL. |
| **jsonwebtoken (JWT)** | `^9.0.0` | Implementación de autenticación segura mediante tokens. |
| **bcrypt** | `^5.1.0` | Librería para el hashing y seguridad de contraseñas. |
| **dotenv** | `^16.0.3` | Gestión de variables de entorno (configuración segura). |
| **cors** | `^2.8.5` | Middleware para permitir el intercambio de recursos entre dominios. |
| **nodemon** | `^3.0.1` | Herramienta de desarrollo para reinicio automático del servidor. |

---

## ⚙️ Instrucciones de Instalación

Siga estos pasos para configurar el entorno de desarrollo:

### 1. Configuración de la Base de Datos
Es necesario crear la base de datos y las tablas en el siguiente orden para mantener la integridad referencial:

```sql
CREATE DATABASE bdtareas;

-- 1. Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT
