# Plataforma de Eventos e Inscripciones

API REST para gestionar usuarios, autenticación, eventos e inscripciones, desarrollada con Node.js, Express y MongoDB.

## Funcionalidades

- Registro e inicio de sesión de usuarios con Passport y JWT.
- Autenticación mediante JWT almacenado en cookie httpOnly.
- Autorización por roles: `user`, `organizer` y `admin`.
- Control de ownership de eventos.
- Creación, consulta, modificación y cambio de estado de eventos.
- Inscripciones mediante tickets asociados a usuarios y eventos.
- Validación de eventos publicados, fechas, cantidades y cupos disponibles.
- Prevención de inscripciones activas duplicadas para un mismo usuario y evento.
- Cancelación lógica de tickets y liberación de cupos.
- Consulta de los tickets del usuario autenticado.
- Consulta de tickets de un evento para su organizador propietario o administrador.
- Envío de emails de confirmación mediante Nodemailer.
- DTOs para controlar la información enviada en las respuestas.
- Arquitectura por capas con Routes, Controllers, Services, Repositories y DAO.
- Middleware de autenticación, autorización y manejo centralizado de errores.

## Tecnologías

- Node.js
- Express
- JavaScript con ES Modules
- MongoDB
- Mongoose
- Passport
- Passport Local
- Passport JWT
- JSON Web Tokens
- bcrypt
- dotenv
- Nodemailer
- Git y GitHub

## Requisitos

- Node.js y npm
- MongoDB local o MongoDB Atlas
- Credenciales SMTP para enviar correos de confirmación

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/martin-Full/proyecto-eventos.git
cd proyecto-eventos
npm install