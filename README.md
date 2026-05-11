# Boxful UI - Portal de Envíos

Este es el frontend profesional para la plataforma de gestión de envíos de Boxful. Construido con **Next.js 14**, **Ant Design** y **Redux Toolkit**

## 🚀 Características Principales

- **Gestión de Órdenes**: Formulario dinámico para creación de envíos con cálculo automático de costos.
- **Historial de Órdenes***: Tabla interactiva con filtros por fecha, búsqueda de texto y estados.
- **Doble Token Auth**: Sistema de seguridad con tokens de aplicación y tokens de usuario con auto-refresco.
- **Exportación de Datos**: Descarga masiva de órdenes en formato CSV.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Kit**: [Ant Design](https://ant.design/)
- **Estado**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Peticiones**: [Axios](https://axios-http.com/) con interceptores para gestión de tokens.
- **Validaciones**: [Yup](https://github.com/jquense/yup) + [React Hook Form](https://react-hook-form.com/)

## ⚙️ Configuración Inicial

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Variables de Entorno**:
   Crea un archivo `.env.local` en la raíz con el siguiente contenido:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/
   NEXT_PUBLIC_APP_ID=BOXFUL_APP_ID
   NEXT_PUBLIC_APP_SECRET=BOXFUL_APP_SECRET
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## 🔐 Credenciales de Prueba

Para probar las funcionalidades de comercio, utiliza las siguientes credenciales (asegúrate de haber ejecutado el `seed` en el backend):

- **Usuario**: `comercio@boxful.com`
- **Contraseña**: `password123`

## 🐳 Desarrollo con Docker (Recomendado)

El entorno de Docker para el frontend está optimizado para desarrollo con **Hot-Reloading** automático.

### Pasos para iniciar:

1. **Configuración de Variables**:
   El contenedor utilizará por defecto `http://localhost:3001/` como URL del API. Si necesitas cambiarla, puedes editar el archivo `docker-compose.yml` o pasarla como variable de entorno.

2. **Levantar el contenedor**:
   ```bash
   docker-compose up --build
   ```

### Notas sobre el contenedor:
- **Volúmenes**: El código fuente está mapeado al contenedor, por lo que cualquier cambio que realices en tu editor se reflejará instantáneamente sin necesidad de reiniciar Docker.
- **Node Modules**: El contenedor maneja su propia carpeta de dependencias para evitar conflictos entre sistemas operativos.
- **Puerto**: La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📁 Estructura del Proyecto

- `src/app`: Rutas y Layouts (Dashboard y Auth).
- `src/components`: Componentes reutilizables.
- `src/services`: Capa de comunicación con el API (Axios).
- `src/store`: Configuración de Redux (Slices para Auth).
- `src/models`: Definición de interfaces y tipos de TypeScript.
- `src/lib`: Configuraciones de librerías (Instancia de Axios).

