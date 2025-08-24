# Sistema de Registro Estudiantil

Este proyecto es una aplicación web full-stack desarrollada con NuxtJs.

##  Características

-   **Gestión de Carreras:** Permite crear y eliminar las carreras que ofrece el instituto.
-   **Registro de Estudiantes:** Un formulario completo para inscribir nuevos estudiantes, asociándolos a una carrera existente.
-   **Visualización en Tiempo Real:** Muestra una lista actualizada de todos los estudiantes registrados.
-   **Operaciones CRUD Completas:** Implementa la creación, lectura y eliminación (CRUD) tanto para carreras como para estudiantes.
-   **Backend Integrado:** Toda la lógica del servidor y la conexión a la base de datos están manejadas directamente dentro del proyecto Nuxt gracias a sus `server routes`.

##  Tecnologías 

-   **Framework:** [Nuxt 3](https://nuxt.com/) (basado en Vue 3)
-   **ORM:** [Prisma](https://www.prisma.io/) para una gestión de la base de datos moderna y segura.
-   **Base de Datos:** [SQLite](https://www.sqlite.org/index.html) para simplicidad y portabilidad (la base de datos es un solo archivo).
-   **Estilos:** CSS plano integrado en el componente de Vue.

## Requisitos 

Para poder levantar este proyecto, necesitas tener instalado:

-   [Node.js](https://nodejs.org/) (se recomienda v18 o superior)
-   [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)

## ️ Instalación y Configuración

Sigue estos pasos en tu terminal para poner en marcha el proyecto:

1.  **Clona el repositorio** (o si ya tienes el código, simplemente navega a la carpeta):
    ```bash
    git clone https://github.com/danielSegoviaVega94/iacc-semana2.git
    cd iacc-semana2
    ```

2.  **Instala las dependencias** del proyecto:
    ```bash
    npm install
    ```

3.  **Configura y crea la base de datos** con Prisma. Este comando leerá el `schema.prisma`, creará el archivo de base de datos `dev.db` y preparará las tablas:
    ```bash
    npx prisma migrate dev
    ```
    Cuando te pregunte, simplemente asigna un nombre a la migración (ej. "initial-setup").

## ▶️ Ejecutar el Proyecto

Una vez completada la instalación, inicia el servidor de desarrollo:

```bash
npm run dev

¡Listo! Abre tu navegador y visita