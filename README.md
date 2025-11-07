# Blog app views

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/luisbaquiaxs-projects/v0-blog-app-views)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/cdSBV0o7hKA)

## Overview

Aplicación de red social/blog construida con Next.js 16, React 19, TypeScript y Tailwind CSS.

### Características

- Sistema de autenticación (Login/Registro)
- Publicaciones con likes y comentarios
- Sistema de amigos y solicitudes de amistad
- Notificaciones en tiempo real
- Perfiles de usuario personalizables
- Feed de publicaciones interactivo
- Diseño responsive y moderno

### Tecnologías

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Estilos**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **HTTP Client**: Axios
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React

## Instalación Local

### Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend API corriendo (por defecto en `http://localhost:8080/api`)

### Pasos de Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <tu-repositorio>
cd blog-app-views
\`\`\`

2. **Instalar dependencias**

Si encuentras errores de dependencias con React 19, usa el flag `--legacy-peer-deps`:

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

O con yarn:

\`\`\`bash
yarn install --ignore-engines
\`\`\`

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto (ya existe `.env.local.example` como referencia):

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

Ajusta la URL según donde esté corriendo tu backend.

4. **Ejecutar en modo desarrollo**

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

\`\`\`
blog-app/
├── app/
│   ├── (auth)/              # Páginas de autenticación
│   │   ├── login/           # Login
│   │   └── register/        # Registro
│   ├── (dashboard)/         # Páginas protegidas
│   │   ├── dashboard/       # Feed principal
│   │   ├── publicaciones/   # Gestión de publicaciones
│   │   ├── perfil/          # Perfil de usuario
│   │   ├── amigos/          # Sistema de amigos
│   │   └── notificaciones/  # Notificaciones
│   └── layout.tsx
├── components/
│   ├── ui/                  # Componentes base de shadcn
│   ├── Navbar.tsx           # Barra de navegación
│   ├── Sidebar.tsx          # Menú lateral
│   ├── PostCard.tsx         # Tarjeta de publicación
│   └── ...
├── lib/
│   ├── axios.ts             # Configuración de Axios
│   └── utils.ts             # Utilidades
└── types/
    └── index.ts             # Tipos TypeScript
\`\`\`

## API Endpoints Esperados

La aplicación espera que tu backend tenga los siguientes endpoints:

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login de usuario

### Usuarios
- `GET /usuarios/:id` - Obtener perfil de usuario
- `PUT /usuarios/:id` - Actualizar perfil
- `GET /usuarios` - Listar usuarios

### Publicaciones
- `GET /publicaciones` - Listar publicaciones (feed)
- `GET /publicaciones/:id` - Obtener publicación específica
- `POST /publicaciones` - Crear publicación
- `PUT /publicaciones/:id` - Actualizar publicación
- `DELETE /publicaciones/:id` - Eliminar publicación

### Likes
- `POST /likes` - Dar like a una publicación
- `DELETE /likes/:id` - Quitar like

### Comentarios
- `GET /comentarios?publicacionId=:id` - Obtener comentarios de una publicación
- `POST /comentarios` - Crear comentario

### Amistades
- `GET /amistad` - Obtener lista de amigos
- `POST /amistad` - Enviar solicitud de amistad
- `PUT /amistad/:id/aceptar` - Aceptar solicitud
- `PUT /amistad/:id/rechazar` - Rechazar solicitud

### Notificaciones
- `GET /notificaciones` - Obtener notificaciones
- `PUT /notificaciones/:id/leer` - Marcar como leída

## Scripts Disponibles

\`\`\`bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar build de producción
npm run lint     # Ejecutar linter
\`\`\`

## Solución de Problemas

### Error de dependencias con React 19

Si al ejecutar `npm install` obtienes errores de peer dependencies:

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### Error de CORS

Si tu backend está en un puerto diferente, asegúrate de que tiene CORS habilitado para `http://localhost:3000`

### Token no se envía

Verifica que el token se esté guardando correctamente en localStorage después del login. Puedes comprobarlo en las DevTools del navegador: Application → Local Storage

## Deployment

Your project is live at:

**[https://vercel.com/luisbaquiaxs-projects/v0-blog-app-views](https://vercel.com/luisbaquiaxs-projects/v0-blog-app-views)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/cdSBV0o7hKA](https://v0.app/chat/cdSBV0o7hKA)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
