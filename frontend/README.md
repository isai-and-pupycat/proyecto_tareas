# Proyecto de Tareas Escolares (Frontend)

Aplicación frontend en **React + TypeScript + Vite** para gestionar periodos escolares, materias, tareas y horarios. Incluye:

- Registro y login de usuario (guardado de token JWT en localStorage)
- CRUD de periodos escolares, materias, tareas y horarios
- Vista de calendario con tareas marcadas por estado
- Vista de horario semanal con materias coloreadas

## Ejecutar en desarrollo

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar servidor de desarrollo:

```bash
npm run dev
```

La app estará disponible en: `http://localhost:5173`

## Conectar con el backend

La URL base de la API se define en `src/services/api.ts` y puede configurarse con la variable de entorno `VITE_API_BASE_URL`.

Ejemplo `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

> Asegúrate de que el backend exponga los endpoints:
> - `POST /auth/login`
> - `POST /auth/register`
> - `GET /auth/me`
> - y los endpoints de `periodos`, `materias`, `tareas`, `horarios`.

## Compilar para producción

```bash
npm run build
```

## Ejecutar build en modo preview

```bash
npm run preview
```

## Estructura principal

- `src/pages/` → Vistas principales: login, dashboard, CRUDs
- `src/contexts/` → Contexto de autenticación (AuthContext)
- `src/services/api.ts` → Cliente Axios con los endpoints del backend

---

**Tip:** Para evitar problemas de CORS, asegúrate de que el backend permita peticiones desde `http://localhost:5173`.
