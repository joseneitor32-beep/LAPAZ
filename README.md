# Sistema de Consulta de Aptos

Aplicación web para la gestión y consulta de postulantes. Permite la importación de datos desde Excel y la visualización con búsqueda y filtrado.

## Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Estilos:** Tailwind CSS
- **Autenticación:** NextAuth.js (Credentials)
- **Excel:** ExcelJS

## Requisitos Previos

- Node.js 18+
- Una base de datos PostgreSQL (ej. Neon)

## Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-del-repo>
    cd app-consulta
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**

    Crea un archivo `.env` en la raíz con lo siguiente:

    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
    NEXTAUTH_SECRET="tu_secreto_super_seguro_generado_con_openssl_rand_base64_32"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Base de Datos y Migraciones:**

    Ejecuta las migraciones de Prisma para crear las tablas:

    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Semilla (Seed) de Usuarios:**

    Crea los usuarios iniciales (Admin e Inspectoria):

    ```bash
    npx prisma db seed
    ```

    **Usuarios creados:**
    - **Admin:** `admin` / `jose32neitor` (Rol: ADMIN)
    - **Inspectoria:** `inspectoria` / `2026` (Rol: INSPECTORIA)

## Ejecución

**Modo Desarrollo:**

```bash
npm run dev
```
Accede a [http://localhost:3000](http://localhost:3000)

**Modo Producción:**

```bash
npm run build
npm start
```

## Funcionalidades por Rol

- **ADMIN:**
    - Acceso total.
    - Puede importar archivos Excel en `/import`.
    - Puede ver el listado en `/postulantes`.
- **INSPECTORIA:**
    - Acceso restringido.
    - SOLO puede ver el listado en `/postulantes`.
    - No tiene acceso a `/import`.

## Estructura del Excel

El archivo Excel debe tener las siguientes columnas (el orden es importante para la detección automática, aunque el sistema intenta ser flexible):
1. N°
2. UNIDAD
3. CÓD. PREINSC.
4. NOMBRE POSTULANTE
5. C.I.
