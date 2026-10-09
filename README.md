Plataforma de Eventos e Inscripciones

API REST para gestionar usuarios, autenticación, eventos e inscripciones, desarrollada con Node.js, Express y MongoDB.

Funcionalidades

Registro e inicio de sesión de usuarios con Passport y JWT.

Autorización por roles (user, organizer y admin) y control de ownership de eventos.

Creación, consulta, modificación y cambio de estado de eventos.

Inscripciones mediante tickets asociados a usuarios y eventos.

Validación de eventos publicados, fechas, cantidades y cupos disponibles.

Prevención de inscripciones activas duplicadas para un mismo usuario y evento.

Cancelación lógica de tickets y liberación de cupos.

Consulta de los tickets del usuario autenticado.

Consulta de tickets de un evento para su organizador propietario o un administrador.

Envío de emails de confirmación con Nodemailer.

Tecnologías

Node.js y Express

JavaScript con ES Modules

MongoDB y Mongoose

Passport, Passport Local, Passport JWT y JSON Web Tokens

bcrypt

dotenv

Nodemailer

Git y GitHub

Requisitos

Node.js y npm

Una instancia de MongoDB local o una cuenta de MongoDB Atlas

Credenciales SMTP para enviar correos de confirmación

Instalación

Clonar el repositorio:

git clone https://github.com/martin-Full/proyecto-eventos.git
cd proyecto-eventos
npm install

Crear un archivo .env en la raíz del proyecto tomando como referencia .env.example.

Variables de entorno

Configurar las siguientes variables en .env:

PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/proyecto-eventos
JWT_SECRET=una_clave_secreta_local
JWT_EXPIRES_IN=1h
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=tu_usuario_smtp
MAIL_PASS=tu_contrasena_smtp
MAIL_FROM=no-reply@proyecto-eventos.com

Los valores de ejemplo de MongoDB y SMTP deben reemplazarse por los de la instancia y el proveedor utilizados. Para SMTP con Gmail, por ejemplo, se puede usar smtp.gmail.com y un método de autenticación admitido por Google.

No subir .env ni contraseñas, tokens o credenciales reales al repositorio. El archivo .env está excluido mediante .gitignore.

Ejecución

Iniciar el servidor en desarrollo:

npm run dev

El servidor escucha en el puerto indicado por PORT (por defecto, 8080). Para iniciar el servidor sin el modo de desarrollo:

npm start

Estructura del proyecto

src/
├── app.js
├── server.js
├── config/
│   ├── env.js
│   ├── database.js
│   └── passport.config.js
├── routes/
│   ├── events.router.js
│   ├── sessions.router.js
│   ├── users.router.js
│   └── tickets.router.js
├── controllers/
│   ├── events.controller.js
│   ├── sessions.controller.js
│   ├── users.controller.js
│   └── tickets.controller.js
├── services/
│   ├── events.service.js
│   ├── users.service.js
│   └── tickets.service.js
├── repositories/
│   ├── events.repository.js
│   ├── users.repository.js
│   └── tickets.repository.js
├── dao/
│   ├── events.dao.js
│   ├── users.dao.js
│   └── tickets.dao.js
├── models/
│   ├── Event.js
│   ├── User.js
│   └── Ticket.js
├── middlewares/
│   ├── auth.middleware.js
│   └── authorize.middleware.js
└── utils/
    ├── hash.js
    ├── jwt.js
    └── mailer.js

Autenticación y roles

Las rutas protegidas requieren autenticación. Las acciones de administración y gestión de eventos también aplican controles de rol y de propietario.

Roles utilizados:

user: puede consultar sus propios tickets e inscribirse en eventos publicados.

organizer: puede gestionar sus propios eventos y consultar las inscripciones de estos.

admin: dispone de permisos administrativos, incluidos los de gestión de eventos y consulta de tickets.

Rutas principales

Sesiones

Método

Ruta

Descripción

POST

/api/sessions/register

Registrar un usuario

POST

/api/sessions/login

Iniciar sesión y obtener el token

GET

/api/sessions/current

Consultar la sesión/usuario autenticado

POST

/api/sessions/logout

Cerrar sesión

Usuarios

Método

Ruta

Descripción

GET

/api/users

Consultar usuarios; requiere permisos de administrador

Eventos

Método

Ruta

Descripción

GET

/api/events

Listar eventos; admite los filtros y la paginación implementados

GET

/api/events/:id

Consultar un evento

POST

/api/events

Crear un evento; requiere rol autorizado

PUT

/api/events/:id

Modificar un evento; requiere autorización del propietario o admin

PATCH

/api/events/:id/status

Cambiar el estado de un evento; requiere autorización del propietario o admin

Estados de evento: draft, published, cancelled y finished. Solo los eventos publicados y futuros aceptan inscripciones.

Tickets e inscripciones

Método

Ruta

Descripción

Acceso

POST

/api/events/:eid/tickets

Crear una inscripción

Usuario autenticado

GET

/api/tickets/my-tickets

Consultar las inscripciones propias

Usuario autenticado

GET

/api/events/:eid/tickets

Consultar tickets de un evento

Organizador propietario o admin

PATCH

/api/tickets/:tid/cancel

Cancelar un ticket propio

Dueño del ticket o admin

Ejemplo de solicitud de inscripción:

{
  "quantity": 1
}

Al crear una inscripción, el sistema valida que el evento exista, esté publicado y no haya finalizado; que la cantidad sea un entero positivo; que haya cupos disponibles; y que el usuario no tenga ya una inscripción activa para el mismo evento.

Estados y capacidad de los tickets

Los tickets tienen los siguientes estados: confirmed, pending y cancelled.

Cada ticket conserva referencias a user y event, la cantidad, un código de reserva y las fechas de creación/cancelación. La cancelación es lógica: el registro no se elimina. Al cancelar un ticket, se marca como cancelled, se registra cancelledAt y se liberan los cupos correspondientes. Los tickets cancelados no cuentan como inscripciones activas.

Email de confirmación

Nodemailer envía un correo después de confirmar una inscripción. La configuración SMTP se carga desde MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS y MAIL_FROM; las credenciales no están hardcodeadas en el código.

La respuesta de creación del ticket incluye emailSent: true cuando Nodemailer acepta el envío, o false cuando el envío falla. El ticket ya confirmado no se revierte por un error SMTP.

Manejo de errores

Las respuestas siguen una estructura JSON con status y, cuando corresponde, data o message. Las rutas aplican códigos HTTP para autenticación, autorización, validación y recursos no encontrados.

Repositorio

https://github.com/martin-Full/proyecto-eventos