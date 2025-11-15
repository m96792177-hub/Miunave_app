# MiuNave App - Guía Completa de Uso

## ENLACES DIRECTOS DEL PROYECTO

### **APLICACIÓN EN VIVO:**
**https://fantastic-haupia-47b632.netlify.app**

### **API BACKEND:**
**https://miunave-backend.onrender.com**

### **CÓDIGO FUENTE:**
**https://github.com/m96792177-hub/Miunave_app**

---

## COMANDOS PARA DESARROLLO LOCAL

### **Instalación:**
```bash
git clone https://github.com/m96792177-hub/Miunave_app.git
cd Miunave_app
npm install
```

### **Ejecutar en desarrollo:**
```bash
# Terminal 1 - Backend (puerto 4000)
npm run backend

# Terminal 2 - Frontend (puerto 5173) 
npm run dev
```

### **Scripts disponibles:**
```bash
npm run dev       # Inicia frontend con Vite
npm run backend   # Inicia servidor Express + SQLite
npm run build     # Compila para producción
npm run preview   # Vista previa del build
npm run seed      # Crea usuario demo (admin/demo123)
npm run lint      # Ejecuta ESLint
```

### **Verificar funcionamiento:**
```bash
# Backend health check
curl http://localhost:4000/api/health

# Frontend
# Abrir http://localhost:5173
```

---

## 🏗️ ESTRUCTURA DEL PROYECTO

```
📦 Miunave_app/
├── 📱 Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx          # Componente principal
│   │   ├── main.jsx         # Entry point
│   │   ├── styles.css       # Estilos globales
│   │   ├── api.js           # Helper para API calls
│   │   └── components/
│   │       └── Auth.jsx     # Sistema login/registro
│   ├── public/
│   │   └── musica/         # Archivos de audio
│   ├── index.html          # HTML base
│   └── vite.config.js      # Configuración Vite
│
├── 🖥️ Backend (Node.js + Express)
│   ├── backend.cjs         # Servidor principal
│   ├── seed.cjs           # Script datos demo
│   └── database.db        # SQLite (generado)
│
├── ☁️ Configuración Hosting
│   ├── netlify.toml       # Config Netlify
│   ├── render.yaml        # Config Render  
│   └── .env.example       # Variables ejemplo
│
└── 📚 Documentación
    ├── README.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── DEPLOYMENT_SUCCESS.md
```

---

## FUNCIONALIDADES IMPLEMENTADAS

### **Reproductor de Música:**
- Playlists por género (Rock, Pop, Trap, etc.)
- Controles completos (play, pause, next, previous)
- Barra de progreso interactiva
- Control de volumen
- Modo shuffle y repeat
- Carga de archivos MP3 locales

### **Sistema de Usuarios:**
- Registro con email/password
- Login con JWT + cookies seguras
- Sesión persistente tras refresh
- Logout completo
- Roles (user/admin)

### **Ecualizador:**
- Control de bajos (60Hz)
- Control de medios (1kHz) 
- Control de agudos (12kHz)
- Procesamiento en tiempo real

### **Chat:**
- Chat entre usuarios registrados
- Mensajes en tiempo real
- Interfaz responsive

### **Búsqueda:**
- Integración con Google
- Integración con YouTube
- ✅ Búsqueda local en canciones

### 🎨 **Interfaz:**
- ✅ Modo claro/oscuro
- ✅ Diseño responsive
- ✅ Reproductor minimizable
- ✅ Navegación por secciones

---

## INFORMACIÓN DE HOSTING

### **Frontend (Netlify):**
- **URL:** https://fantastic-haupia-47b632.netlify.app
- **Plan:** Gratuito
- **Build:** Automático desde GitHub
- **CDN:** Global

### **Backend (Render):**
- **URL:** https://miunave-backend.onrender.com
- **Plan:** Gratuito  
- **Runtime:** Node.js 18
- **Base de datos:** SQLite

### **Configuraciones:**
- **CORS:** Habilitado para cross-origin
- **Cookies:** Secure + SameSite=None en producción
- **API:** Auto-detecta localhost vs producción
- **Build:** Optimizado para producción

---

## USUARIOS DEMO

### **Crear usuario admin:**
```bash
npm run seed
# Crea: email: demo@miunave.app, password: demo123
```

### 📝 **O registrarse normalmente:**
- Ve a la sección "Perfil" 
- Click "¿No tienes cuenta? Regístrate"
- Completa email/nombre/password

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### **Frontend:**
- ⚛️ React 18.2.0
- ⚡ Vite 7.2.2  
- 🎨 CSS3 con variables
- 🔊 Web Audio API

### **Backend:**
- 🟢 Node.js + Express 5.1.0
- 🗄️ SQLite + better-sqlite3
- 🔐 JWT + bcrypt
- CORS + cookies

### **Hosting:**
- Netlify (Frontend)
- Render (Backend)
- GitHub (Repositorio)

---

## SOPORTE Y TESTING

### **Endpoints de prueba:**
```bash
# Health check backend
GET https://miunave-backend.onrender.com/api/health

# Registro usuario
POST https://miunave-backend.onrender.com/api/register
{
  "nombre": "Test User",
  "email": "test@test.com", 
  "password": "123456"
}

# Login
POST https://miunave-backend.onrender.com/api/login
{
  "email": "test@test.com",
  "password": "123456" 
}
```

### **Verificar funcionamiento:**
1. **Frontend:** Abrir URL y probar navegación
2. **Auth:** Registro/login debe crear cookies
3. **Music:** Reproducir playlists predefinidas
4. **Cross-origin:** Login desde Netlify debe funcionar

---

## **FECHA DE ENTREGA:** 14 de Noviembre, 2025
## **ESTADO:** Completamente funcional y desplegado