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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Periodos
CREATE TABLE periodos (
    id_periodo SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- 3. Tabla de Materias
CREATE TABLE materias (
    id_materia SERIAL PRIMARY KEY,
    id_periodo INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    profesor VARCHAR(100),
    FOREIGN KEY (id_periodo) REFERENCES periodos(id_periodo)
);

-- 4. Tabla de Horarios
CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    id_materia INTEGER NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    salon VARCHAR(50),
    FOREIGN KEY (id_materia) REFERENCES materias(id_materia)
);

-- 5. Tabla de Tareas
CREATE TABLE tareas (
    id_tarea SERIAL PRIMARY KEY,
    id_materia INTEGER NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_materia) REFERENCES materias(id_materia)
);
```

### 2. Clonar el Repositorio
```bash
git clone https://github.com/isai-and-pupycat/proyecto_tareas.git
cd proyecto_tareas
```

### 3. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 4. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `backend` con la siguiente estructura:

```env
PORT=3000
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/bdtareas
JWT_SECRET=tu_clave_secreta_jwt
NODE_ENV=development
```

### 5. Iniciar el Servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
proyecto_tareas/
├── backend/              # API REST con Express.js y PostgreSQL
│   ├── src/
│   │   ├── app.js       # Configuración principal
│   │   ├── server.js    # Iniciador del servidor
│   │   ├── config/      # Configuración (BD, etc.)
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── routes/      # Definición de rutas
│   │   └── middlewares/ # Middlewares personalizados
│   ├── .env             # Variables de entorno
│   └── package.json     # Dependencias del backend
│
├── frontend/            # Interfaz de usuario (próximamente)
├── bd/                  # Scripts SQL para la BD
└── README.md            # Este archivo
```

---

## 🔐 Características de Seguridad

- ✅ **Autenticación JWT**: Tokens seguros para acceso a la API
- ✅ **Encriptación de Contraseñas**: Implementación de bcrypt
- ✅ **CORS Configurado**: Control de acceso entre dominios
- ✅ **Variables de Entorno**: Gestión segura de credenciales
- ✅ **Validación de Datos**: Verificación en todos los endpoints

---

## 📝 API Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Periodos Académicos
- `GET /api/periodos` - Listar periodos del usuario
- `POST /api/periodos` - Crear nuevo periodo
- `PUT /api/periodos/:id` - Actualizar periodo
- `DELETE /api/periodos/:id` - Eliminar periodo

### Materias
- `GET /api/materias/:periodo_id` - Listar materias de un periodo
- `POST /api/materias` - Crear nueva materia
- `PUT /api/materias/:id` - Actualizar materia
- `DELETE /api/materias/:id` - Eliminar materia

### Horarios
- `GET /api/horarios/:materia_id` - Listar horarios de una materia
- `POST /api/horarios` - Crear horario
- `PUT /api/horarios/:id` - Actualizar horario
- `DELETE /api/horarios/:id` - Eliminar horario

### Tareas
- `GET /api/tareas/:materia_id` - Listar tareas de una materia
- `POST /api/tareas` - Crear tarea
- `PUT /api/tareas/:id` - Actualizar tarea
- `DELETE /api/tareas/:id` - Eliminar tarea

---

## 👨‍💻 Autor

**Isai rosas canto** - [GitHub](https://github.com/isai-and-pupycat)

---

## 📄 Licencia

🎓 Información del Proyecto
Universidad: [Nombre de tu Universidad aquí]

Desarrollador: Isai Rosas Canto Fecha: 12 de marzo de 2026                             
