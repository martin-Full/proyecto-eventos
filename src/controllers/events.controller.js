import {
    getAllEvents,
    createEventService,
    getEventByIdService,
    updateEventService,
    deleteEventService
} from "../services/events.service.js";

export const getEvents = async (req, res) => {
    try {
        const events = await getAllEvents();

        res.status(200).json({
            status: "success",
            payload: events
        });
    } catch (error) {
        console.error("Error al obtener eventos:", error);

        res.status(500).json({
            status: "error",
            message: "Error al obtener los eventos"
        });
    }
};

export const createEvent = async (req, res) => {
    try {
        const event = await createEventService({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            status: "success",
            payload: event
        });
    } catch (error) {
        console.error("Error al crear evento:", error);

        res.status(500).json({
            status: "error",
            message: "Error al crear el evento"
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await getEventByIdService(id);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner = event.createdBy.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para modificar este evento"
            });
        }

        const updatedEvent = await updateEventService(id, req.body);

        res.status(200).json({
            status: "success",
            payload: updatedEvent
        });
    } catch (error) {
        console.error("Error al modificar evento:", error);

        res.status(500).json({
            status: "error",
            message: "Error al modificar el evento"
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await getEventByIdService(id);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner = event.createdBy.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para cancelar este evento"
            });
        }

        await deleteEventService(id);

        res.status(200).json({
            status: "success",
            message: "Evento eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar evento:", error);

        res.status(500).json({
            status: "error",
            message: "Error al eliminar el evento"
        });
    }
};