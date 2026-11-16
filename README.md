# Portafolio de Sebastian Bernal

Portafolio personal de desarrollo web full stack. Presenta mis proyectos, las tecnologías que utilizo y un poco sobre mí, con una interfaz interactiva y adaptable a distintos tamaños de pantalla.

## Funcionalidades

- Página principal con proyectos destacados y resumen de tecnologías.
- Catálogo de proyectos con filtros, paginación y páginas de detalle.
- Secciones para conocerme y ponerse en contacto.
- Panel privado para crear, editar y administrar proyectos.
- Autenticación con credenciales para proteger el panel.

## Tecnologías

- Next.js 16 y React 19 con TypeScript.
- Tailwind CSS 4 y Motion para estilos y animaciones.
- Neon Postgres para los proyectos y usuarios.
- NextAuth para la autenticación.

## Requisitos

- Node.js compatible con Next.js 16.
- Una base de datos Neon Postgres configurada con las tablas `projects` y `users`.
- La variable `DATABASE_URL` con la cadena de conexión a la base de datos.
- La variable `AUTH_SECRET` para la autenticación.

Configura las variables en un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=tu_cadena_de_conexion
AUTH_SECRET=tu_secreto_de_autenticacion
```

## Desarrollo local

Instala las dependencias e inicia el servidor:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Comandos

```bash
npm run dev    # Servidor de desarrollo
npm run lint   # Revisión con ESLint
npm run build  # Compilación de producción
npm run start  # Servidor de producción
```
