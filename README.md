# HexaTask 📋

Aplicación móvil de gestión de tareas desarrollada con React Native y Expo, aplicando **Arquitectura Hexagonal (Ports & Adapters)**, especializada en la organización personal de tareas con soporte de autenticación, edición de perfil y exportación de PDF.

---

## 🛠️ Requisitos 

Para poder utilizar este software necesitarás: 

- React Native CLI o Expo CLI
- Node.js 18+
- Expo Go o emulador Android/iOS
- Cuenta en [expo.dev](https://expo.dev) (opcional, para builds)

---

## ⚙️ Instalación 

Paso a paso para obtener un entorno de desarrrollo ejecutable

**1. Clonar el repositorio**
```
git clone https://github.com/Jhon-Zuluaga/IncidentAPI.git
cd HexaTask
```

**2. Instalar dependencias**
```
npm install
```

**3. Iniciar el proyecto**
```
npx expo start
```

**4. Abrir en dispositivo**

Escanea el QR con Expo Go o presiona 'a' para android / 'i' para iOS en el emulador.

---

## Características

### Autenticación
- Registro e inicio de sesión
- Persistencia de sesión automática
- Cierre de sesión

### Gestión de tareas
- Crear, editar y eliminar tarea
- Marcar tareas como completadas
- Contador de tareas pendientes y completadas

### Perfil de usuario
- Ver datos del perfil (nombre, correo, contraseña)
- Editar nombre, correo y contraseña
- Avatar con inicial del nombre

### Exportación
- Generar PDF con la lista de tareas
- Compartir PDF por WhatsApp, Drive, Telegram, etc..
- Animacione en el panel del perfil

### UI/UX
- Modo oscuro automático según el sistema
- Diseño adaptable a todos los tamaños de pantalla
- Animaciones en el panel del perfil
  
---

## Arquitectura

El proyecto aplica la **Arquitectura Hexagonal (Ports & Adapters)**. La idea central es que el núcleo de la aplicación (dominio) no depende de ninguna tecnología externa.

```
src/
├── domain/                    → Núcleo — sin imports de React Native
│   ├── entities/              → Modelos de negocio (User, Task)
│   ├── ports/                 → Contratos/interfaces
│   └── usecases/              → Lógica de negocio
│       ├── auth/              → Login, Register, UpdateProfile
│       └── tasks/             → Create, Get, Toggle, Edit, Delete
│
├── infrastructure/            → Adaptadores secundarios
│   └── repositories/         → Implementaciones con AsyncStorage
│
└── presentation/              → Adaptadores primarios
    ├── navigation/            → AppNavigator
    ├── screens/               → LoginScreen, RegisterScreen, TasksScreen
    ├── stores/                → authStore, taskStore (Zustand)
    ├── templates/             → TasksPDFTemplate
    └── styles/                → Estilos separados por pantalla
```

### Regla de dependencia
```
Presentación -> Dominio <- Infraestructura
```

El dominio nunca importa nada de React Native ni de librerías externas. Si mañana se cambia AsyncStorage por una API REST, solo se toca la capa de infraestructura sin modificar nada del dominio ni la presentación.

---

## Construido con
| Tecnología | Uso |
|---|---|
| React Native + Expo | Framework móvil |
| TypeScript | Tipado estático |
| Zustand | Manejo de estado global |
| AsyncStorage | Persistencia local de datos |
| expo-print | Generación de PDF |
| expo-sharing | Compartir archivos |
| React Navigation | Navegación entre pantallas |

---
