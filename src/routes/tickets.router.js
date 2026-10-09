import { Router } from "express";

import {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
} from "../controllers/tickets.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

import {
    authorize,
    loadEvent,
    authorizeEventOwnerOrAdmin
} from "../middlewares/authorize.middleware.js";

const router = Router();

// Usuario autenticado: inscribirse
router.post(
    "/events/:eid/tickets",
    auth,
    createTicket
);

// Usuario autenticado: ver sus propios tickets
router.get(
    "/tickets/my-tickets",
    auth,
    getMyTickets
);

// Organizer dueño del evento o admin: ver tickets
router.get(
    "/events/:eid/tickets",
    auth,
    authorize("organizer", "admin"),
    loadEvent,
    authorizeEventOwnerOrAdmin,
    getEventTickets
);

// Dueño del ticket o admin: cancelar
router.patch(
    "/tickets/:tid/cancel",
    auth,
    cancelTicket
);

export default router;