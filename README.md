# 🍽️ RestoBar AI - Sistema Inteligente de Gestión

Sistema móvil completo para gestión de restobar con inteligencia artificial, IoT y base de datos en tiempo real.

## 📱 Características Principales

- **🔐 Sistema de Login** - Autenticación segura de usuarios
- **🤖 Reconocimiento IA** - Identificación automática de productos con cámara
- **📊 Dashboard Analytics** - Estadísticas de ventas y KPIs en tiempo real
- **🌡️ Monitoreo IoT** - Sensores de temperatura, humedad y calidad del aire
- **💾 Base de Datos** - Supabase con tablas optimizadas
- **📈 Gráficos Dinámicos** - Visualización de datos en tiempo real

## 🚀 Tecnologías Utilizadas

### Frontend
- **React Native** - Framework móvil multiplataforma
- **Expo** - Plataforma de desarrollo y deployment
- **TypeScript** - Tipado estático para JavaScript
- **React Navigation** - Navegación entre pantallas

### Backend & Base de Datos
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Base de datos relacional
- **Real-time Subscriptions** - Actualizaciones en tiempo real

### IA & IoT
- **Computer Vision** - Reconocimiento de objetos
- **ESP32 + DHT22** - Sensores de temperatura y humedad
- **MQTT Protocol** - Comunicación IoT

## 📋 Requisitos Previos

- **Node.js** 16 o superior
- **npm** o **yarn**
- **Git**
- **Expo CLI** (se instala automáticamente)


#### npm install
```


#### Para Web (Recomendado para desarrollo):
```bash
npx expo start --web
```

#### Para Móvil:
```bash
# Instalar Expo Go en tu teléfono desde Play Store/App Store
npx expo start
# Escanear QR code con Expo Go
```

## 🎯 Uso de la Aplicación

### Login
- **Usuario:** `admin`
- **Contraseña:** `restobar123`

### Navegación
La app tiene 3 pantallas principales:

#### 📊 Estadísticas
- Dashboard con ventas en tiempo real
- Gráficos de productos más vendidos
- KPIs del negocio
- Alertas del sistema

#### 📸 Cámara IA
- Reconocimiento automático de productos
- Simulación realista con animaciones
- 6 productos pre-configurados:
  - 🍕 Pizza Margherita - S/ 25.00
  - 🍔 Hamburguesa Clásica - S/ 18.00
  - 🍺 Cerveza Artesanal - S/ 8.00
  - 🍹 Cóctel Tropical - S/ 15.00
  - ☕ Café Americano - S/ 6.00
  - 🥗 Ensalada César - S/ 12.00

#### 🌡️ Sensores IoT
- 3 sensores monitoreados:
  - **ESP32_001** - Salón Principal
  - **ESP32_002** - Cocina
  - **ESP32_003** - Almacén
- Lecturas de temperatura, humedad y calidad del aire
- Gráficos históricos
- Control de conexión/desconexión

## 📁 Estructura del Proyecto

```
restobar-ai-app/
├── App.tsx                 # Componente principal
├── src/
│   └── screens/
│       ├── LoginScreen.tsx     # Pantalla de login
│       ├── StatsScreen.tsx     # Dashboard de estadísticas
│       ├── CameraScreen.tsx    # Reconocimiento IA
│       └── IoTScreen.tsx       # Monitoreo de sensores
├── database_schema.sql     # Script de base de datos
├── package.json           # Dependencias del proyecto
└── README.md             # Esta documentación
```




## 🧪 Testing

### Credenciales de Prueba
- **Usuario Admin:** admin / restobar123
- **Base de datos:** Pre-poblada con datos de ejemplo
- **Sensores:** Simulación automática activada

### Datos de Prueba
- **Ventas:** Transacciones simuladas de la última semana
- **Productos:** 6 items del menú configurados
- **Sensores:** 3 ubicaciones con lecturas realistas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Proyecto RestoBar AI**
- Desarrollado para presentación académica
- Sistema completo de gestión gastronómica
- Integración de IA, IoT y Analytics

## 📞 Soporte

Si tienes problemas:
1. Revisa esta documentación
2. Verifica que todas las dependencias estén instaladas
3. Confirma que Supabase esté configurado correctamente
4. Asegúrate de usar las credenciales de login correctas

---

**¡Listo para presentar! 🚀**

La aplicación está optimizada para demostraciones y presenta todas las funcionalidades de un sistema real de gestión para restobar con IA.