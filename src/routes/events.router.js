import { Router } from "express";
import {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/events.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getEvents);

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
    updateEvent
);

router.delete(
    "/:id",
    auth,
    authorize("organizer", "admin"),
    deleteEvent
);

export default router;