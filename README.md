# MiuNave App — Deploy

Este proyecto incluye:
- Frontend: React + Vite (JavaScript)
- Backend: Node + Express (CommonJS) con `better-sqlite3` (SQLite)
- Autenticación con JWT y cookies (con credenciales)

## Variables de entorno

Frontend (Vite):
- `VITE_API_URL`: URL base del backend (por ejemplo, `https://miunave-backend.onrender.com`). En desarrollo no es necesaria (usa `http://localhost:4000`).

Backend:
- `PORT`: puerto de escucha (Render lo inyecta).
- `JWT_SECRET`: secreto para firmar JWT (Render puede generarlo con `generateValue: true`).
- `ALLOWED_ORIGINS`: lista separada por comas con orígenes permitidos para CORS (por ejemplo: `https://<tu-sitio>.netlify.app,http://localhost:5173`).

## Despliegue recomendado

- Frontend en Netlify (gratis, perfecto para Vite). Ya está `netlify.toml` con build y redirect SPA.
- Backend en Render (gratis). Ya está `render.yaml` para crear el servicio web con Node.
- SQLite se almacena como archivo `database.db` al lado de `backend.cjs`. En Render (plan free) el disco es efímero: los cambios pueden resetearse al reiniciar/despertar. Para una entrega académica suele ser suficiente; si necesitas persistencia real, considera Fly.io con volumen persistente.

### Pasos detallados

1) Backend en Render (Blueprint)
	- Botón: New + Blueprint y selecciona tu repo con este proyecto.
	- Render detectará `render.yaml` y listará el servicio `miunave-backend`.
	- Revisa las variables:
	  - `JWT_SECRET`: dejar que Render la genere o poner una propia segura.
	  - `ALLOWED_ORIGINS`: después del primer deploy agrega tu dominio Netlify (ej. `https://tu-sitio.netlify.app,http://localhost:5173`).
	- Deploy: al terminar Render mostrará una URL (ej. `https://miunave-backend.onrender.com`).
	- Test rápido:
	  - `curl https://<render-url>/api/health` debe devolver JSON con usuarios.
	  - Ejecuta `npm run seed` local antes si quieres que aparezca un usuario.

2) Frontend en Netlify
	- New Site from Git.
	- Selecciona el repo.
	- Build command: `npm run build`.
	- Publish directory: `dist`.
	- Environment variable: `VITE_API_URL` = URL del backend.
	- Deploy y abre la URL generada.

3) Pruebas funcionales
	- Abrir Netlify URL y hacer Registro → Ver cookie (Application/Storage).
	- Refrescar y validar que mantiene sesión (usa `/api/verify`).
	- Logout y verificar cookie eliminada.

4) CORS si falla
	- Error de CORS: añade exactamente el dominio Netlify (sin `/`) en `ALLOWED_ORIGINS` de Render y re-deploy.

### Alternativa con persistencia (Opcional)
Si necesitas que SQLite persista tras reinicios, usa Fly.io:
1. Instala Fly CLI: `npm install -g flyctl`.
2. `flyctl launch` (elige nombre y región) sin cambiar estructura.
3. Crea un volumen: `flyctl volumes create db_volume --size 1 --region <region>`.
4. Modifica `backend.cjs` para usar ruta `/data/database.db` y en `fly.toml` monta el volumen en `/data`.
5. Deploy: `flyctl deploy`.
6. Ajusta `VITE_API_URL` en Netlify a la nueva URL.
Nota: Fly requiere pequeñas adaptaciones (no hechas todavía para no tocar tu estructura actual). Puedo generarlas si lo pides.

## Desarrollo local

- Backend: `npm run backend` (puerto 4000). CORS permite `http://localhost:5173`.
- Frontend: `npm run dev` (Vite en 5173). 

```
# en una terminal
npm run backend

# en otra terminal
npm run dev
```

## Detalles de estilo
- En modo claro, el título `MiuNave` usa color amarillo legible (`#f4c430`).

## Notas
- No se eliminaron archivos existentes ni se cambió la estructura. Se añadieron `netlify.toml`, `render.yaml`, `src/api.js`, `.env.example`, `seed.cjs` y se amplió este `README.md`.
- Endpoint extra `/api/health` para checks.