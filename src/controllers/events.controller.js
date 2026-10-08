import {
    getAllEvents,
    createEventService,
    getEventByIdService,
    updateEventService,
    publishEvent,
    cancelEvent
} from "../services/events.service.js";

export const getEvents = async (req, res) => {
    try {
        const {
            status,
            category,
            location,
            dateFrom,
            dateTo,
            page,
            limit,
            sort
        } = req.query;

        const result = await getAllEvents({
            status,
            category,
            location,
            dateFrom,
            dateTo,
            page,
            limit,
            sort
        });

        res.status(200).json({
            status: "success",
            data: result.events,
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages
        });
    } catch (error) {
        console.error("Error al obtener eventos:", error);

        res.status(500).json({
            status: "error",
            message: "Error al obtener los eventos"
        });
    }
};

export const getEvent = async (req, res) => {
    try {
        const event = await getEventByIdService(req.params.id);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        res.status(200).json({
            status: "success",
            data: event
        });
    } catch (error) {
        console.error("Error al obtener evento:", error);

        res.status(500).json({
            status: "error",
            message: "Error al obtener el evento"
        });
    }
};

export const createEvent = async (req, res) => {
    try {
        const event = await createEventService({
            ...req.body,
            organizer: req.user._id
        });

        res.status(201).json({
            status: "success",
            data: event
        });
    } catch (error) {
        console.error("Error al crear evento:", error);

        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await getEventByIdService(req.params.id);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }


        const updatedEvent = await updateEventService(
            req.params.id,
            req.body
        );

        res.status(200).json({
            status: "success",
            data: updatedEvent
        });
    } catch (error) {
        console.error("Error al modificar evento:", error);

        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                status: "error",
                message: "El estado es obligatorio"
            });
        }

        const event = await getEventByIdService(id);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }


        let updatedEvent;

        if (status === "published") {
            updatedEvent = await publishEvent(id);
        } else if (status === "cancelled") {
            updatedEvent = await cancelEvent(id);
        } else {
            return res.status(400).json({
                status: "error",
                message: "Solo se permite publicar o cancelar eventos mediante esta ruta"
            });
        }

        res.status(200).json({
            status: "success",
            data: updatedEvent
        });
    } catch (error) {
        console.error("Error al cambiar estado:", error);

        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};