# Plataforma de Eventos e Inscripciones

API REST para una Plataforma de Eventos e Inscripciones, desarrollada con Node.js, Express y MongoDB.

## Descripción

El proyecto consiste en el desarrollo de una API REST para gestionar una Plataforma de Eventos e Inscripciones.

En esta etapa se implementa y refactoriza el sistema de autenticación utilizando Passport.js, manteniendo el comportamiento externo de las rutas existentes.

La autenticación incluye:

- Registro de usuarios.
- Validación de datos.
- Normalización de emails.
- Hash de contraseñas mediante bcrypt.
- Login de usuarios.
- Generación de tokens JWT.
- Autenticación mediante cookies HTTP-only.
- Consulta del usuario autenticado.
- Cierre de sesión mediante logout.
- Estrategias de autenticación mediante Passport.js.
- Validación del JWT desde la cookie `currentUser`.

El proyecto utiliza una arquitectura por capas para separar responsabilidades entre rutas, controladores, repositorios, DAO, modelos y utilidades.

---

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript
- ES Modules
- MongoDB
- MongoDB Atlas
- Mongoose
- Passport.js
- Passport Local
- Passport JWT
- bcrypt
- jsonwebtoken
- dotenv
- Cookies HTTP-only
- Nodemon

---

## Requisitos

Para ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm
- Una cuenta de MongoDB Atlas

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/martin-Full/proyecto-eventos.git