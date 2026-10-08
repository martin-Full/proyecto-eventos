import { Router } from "express";

import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    updateEventStatus
} from "../controllers/events.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

import {
    authorize,
    authorizeEventOwnerOrAdmin,
    loadEvent
} from "../middlewares/authorize.middleware.js";

const router = Router();

// Público
router.get("/", getEvents);

router.get("/:id", getEvent);

// Organizer / Admin
router.post(
    "/",
    auth,
    authorize("organizer", "admin"),
    createEvent
);

router.put(
    "/:id",
    auth,
    authorize("organizer", "admin"),
    loadEvent,
    authorizeEventOwnerOrAdmin,
    updateEvent
);

router.patch(
    "/:id/status",
    auth,
    authorize("organizer", "admin"),
    loadEvent,
    authorizeEventOwnerOrAdmin,
    updateEventStatus
);

export default router;