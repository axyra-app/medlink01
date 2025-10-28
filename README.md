# Medlink - Marketplace Médico On-Demand

Una aplicación web progresiva (PWA) que conecta pacientes con doctores para consultas médicas a domicilio.

## 🚀 Características

- **Autenticación**: Sistema de login/registro con Firebase Auth
- **Roles**: Pacientes y Doctores con interfaces diferenciadas
- **Tiempo Real**: Actualizaciones en vivo usando Firestore
- **Mapas**: Integración con Mapbox para ubicación y rutas
- **PWA**: Instalable en dispositivos móviles
- **Responsive**: Diseño mobile-first con TailwindCSS

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v6
- **State Management**: Zustand + React Context
- **Backend**: Firebase (Auth + Firestore)
- **Maps**: Mapbox GL JS
- **Icons**: Lucide React
- **PWA**: Vite Plugin PWA

## 📱 Flujo de la Aplicación

### Para Pacientes:
1. **Login/Registro** → Seleccionar rol "Paciente"
2. **Home** → Ver mapa y describir síntomas
3. **Esperando Doctor** → Estado "pending"
4. **Doctor en Ruta** → Estado "accepted", tracking en tiempo real
5. **Consulta en Curso** → Estado "in-progress"
6. **Reseña** → Estado "completed", calificar servicio

### Para Doctores:
1. **Login/Registro** → Seleccionar rol "Doctor"
2. **Dashboard** → Toggle online/offline
3. **Lista de Solicitudes** → Ver solicitudes disponibles
4. **Aceptar Servicio** → Cambiar estado a "in-service"
5. **Detalle del Servicio** → Ver ubicación del paciente
6. **Finalizar Consulta** → Cambiar estado a "completed"

## 🔧 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/medlink.git
cd medlink

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview
```

## 🔥 Configuración de Firebase

### 1. Crear Proyecto en Firebase
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Crea un nuevo proyecto: `medlink-4a4fd`

### 2. Habilitar Authentication
- Ve a **Authentication** → **Sign-in method**
- Habilita **Email/Password**

### 3. Crear Firestore Database
- Ve a **Firestore Database**
- Crea base de datos en modo **test**

### 4. Configurar Reglas de Seguridad

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para solicitudes de servicio
    match /serviceRequests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para ubicaciones de doctores
    match /doctorLocations/{locationId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para reseñas
    match /reviews/{reviewId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Crear Índices Compuestos

En **Firestore** → **Indexes** → **Composite**, crear:

```
Collection: serviceRequests
Fields:
- status (Ascending)
- createdAt (Ascending)

Collection: serviceRequests  
Fields:
- status (Ascending)
- patientGeohash (Ascending)

Collection: doctorLocations
Fields:
- doctorId (Ascending)
- timestamp (Descending)

Collection: reviews
Fields:
- doctorId (Ascending)
- createdAt (Descending)
```

## 🗺️ Configuración de Mapbox

1. **Crear cuenta**: [Mapbox](https://www.mapbox.com/)
2. **Obtener token**: Dashboard → Default public token
3. **Token configurado**: `pk.eyJ1IjoibWVkbGluazAxIiwiYSI6ImNtaGFxeXp3OTB6eHEya3B2enh6c3ljaGIifQ.fNLLY7BuMPp-gsTevR1JoQ`

## 🚀 Despliegue en Vercel

### 1. Conectar con GitHub
```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/medlink.git
git push -u origin main
```

### 2. Desplegar en Vercel
1. Ve a [Vercel](https://vercel.com/)
2. **Import Project** → Selecciona tu repositorio de GitHub
3. **Deploy** → La aplicación se desplegará automáticamente

### 3. Configurar Variables de Entorno (Opcional)
Si prefieres usar variables de entorno en lugar de hardcoded:

```bash
# En Vercel Dashboard → Settings → Environment Variables
VITE_FIREBASE_API_KEY=AIzaSyAJ_ihEyLn3bp2v-yH-z6-1-5EdRHabHGU
VITE_FIREBASE_AUTH_DOMAIN=medlink-4a4fd.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medlink-4a4fd
VITE_FIREBASE_STORAGE_BUCKET=medlink-4a4fd.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=231645471951
VITE_FIREBASE_APP_ID=1:231645471951:web:61d23613034e6832bc03ba
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoibWVkbGluazAxIiwiYSI6ImNtaGFxeXp3OTB6eHEya3B2enh6c3ljaGIifQ.fNLLY7BuMPp-gsTevR1JoQ
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI base
│   ├── patient/        # Componentes específicos de pacientes
│   ├── doctor/         # Componentes específicos de doctores
│   └── maps/           # Componentes de mapas
├── pages/              # Páginas de la aplicación
│   ├── auth/          # Login y registro
│   ├── patient/       # Páginas de pacientes
│   └── doctor/        # Páginas de doctores
├── hooks/              # Custom hooks
├── store/              # Estado global (Zustand)
├── lib/                # Configuraciones (Firebase)
├── types/              # Definiciones de TypeScript
└── App.tsx             # Componente principal
```

## 🔐 Seguridad

- **Authentication**: Firebase Auth con email/password
- **Authorization**: Reglas de Firestore por rol de usuario
- **Data Validation**: Validación en frontend y reglas de Firestore
- **CORS**: Configurado para dominios específicos

## 📱 PWA Features

- **Instalable**: Se puede instalar en dispositivos móviles
- **Offline**: Service Worker para funcionalidad offline básica
- **Push Notifications**: Preparado para notificaciones (futuro)
- **Responsive**: Optimizado para móviles

## 🧪 Testing

```bash
# Ejecutar tests (cuando se implementen)
npm run test

# Tests con coverage
npm run test:coverage
```

## 📈 Monitoreo

- **Firebase Analytics**: Configurado para métricas
- **Error Tracking**: Preparado para Sentry (futuro)
- **Performance**: Lighthouse optimizado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte, envía un email a soporte@medlink.com o crea un issue en GitHub.

---

**Desarrollado con ❤️ para mejorar el acceso a la atención médica**