import { getEventByIdRepository } from "../repositories/events.repository.js";

// Autorizar por rol
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "No autenticado"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para realizar esta acción"
            });
        }

        next();
    };
};

// Autorizar al organizador propietario o al administrador
export const authorizeEventOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: "error",
            message: "No autenticado"
        });
    }

    if (req.user.role === "admin") {
        return next();
    }

    if (!req.event) {
        return res.status(404).json({
            status: "error",
            message: "Evento no encontrado"
        });
    }

    const organizerId = req.event.organizer?._id
        ? req.event.organizer._id.toString()
        : req.event.organizer.toString();

    if (organizerId !== req.user._id.toString()) {
        return res.status(403).json({
            status: "error",
            message: "No tenés permisos para modificar este evento"
        });
    }

    next();
};

// Cargar el evento antes de comprobar su propietario
export const loadEvent = async (req, res, next) => {
    try {
        const eventId = req.params.id || req.params.eid;

        if (!eventId) {
            return res.status(400).json({
                status: "error",
                message: "Falta el identificador del evento"
            });
        }

        const event = await getEventByIdRepository(eventId);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        req.event = event;
        next();

    } catch (error) {
        console.error("Error al cargar evento:", error);

        return res.status(500).json({
            status: "error",
            message: "Error al obtener el evento"
        });
    }
};