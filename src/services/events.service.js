import {
    getEvents,
    createEventRepository,
    getEventByIdRepository,
    updateEventRepository
} from "../repositories/events.repository.js";

const ALLOWED_STATUSES = [
    "draft",
    "published",
    "cancelled",
    "finished"
];

const validateEventData = (eventData, isUpdate = false) => {
    const {
        title,
        description,
        category,
        date,
        location,
        capacity,
        price
    } = eventData;

    if (!isUpdate) {
        if (!title || !description || !category || !date || !location) {
            throw new Error("Faltan campos obligatorios");
        }
    }

    if (capacity !== undefined && Number(capacity) <= 0) {
        throw new Error("La capacidad debe ser mayor a 0");
    }

    if (price !== undefined && Number(price) < 0) {
        throw new Error("El precio no puede ser negativo");
    }

    if (date !== undefined) {
        const eventDate = new Date(date);

        if (Number.isNaN(eventDate.getTime())) {
            throw new Error("La fecha del evento no es válida");
        }

        if (!isUpdate && eventDate <= new Date()) {
            throw new Error("La fecha del evento debe ser futura");
        }
    }
};

export const getAllEvents = async (options = {}) => {
    let {
        status,
        category,
        location,
        dateFrom,
        dateTo,
        page = 1,
        limit = 10,
        sort = "date"
    } = options;

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
        page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
        limit = 10;
    }

    if (limit > 50) {
        limit = 50;
    }

    const filters = {};

    if (status) {
        if (!ALLOWED_STATUSES.includes(status)) {
            throw new Error("Estado no válido");
        }

        filters.status = status;
    }

    if (category) {
        filters.category = category;
    }

    if (location) {
        filters.location = {
            $regex: location,
            $options: "i"
        };
    }

    if (dateFrom || dateTo) {
        filters.date = {};

        if (dateFrom) {
            const from = new Date(dateFrom);

            if (Number.isNaN(from.getTime())) {
                throw new Error("dateFrom no es una fecha válida");
            }

            filters.date.$gte = from;
        }

        if (dateTo) {
            const to = new Date(dateTo);

            if (Number.isNaN(to.getTime())) {
                throw new Error("dateTo no es una fecha válida");
            }

            filters.date.$lte = to;
        }
    }

    const result = await getEvents({
        filters,
        page,
        limit,
        sort
    });

    return {
        events: result.events,
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
    };
};

export const createEventService = async (eventData) => {
    validateEventData(eventData);

    return await createEventRepository(eventData);
};

export const getEventByIdService = async (id) => {
    return await getEventByIdRepository(id);
};

export const updateEventService = async (id, eventData) => {
    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    if (event.status === "cancelled") {
        throw new Error("No se puede modificar un evento cancelado");
    }

    if (eventData.status !== undefined) {
        if (!ALLOWED_STATUSES.includes(eventData.status)) {
            throw new Error("Estado no válido");
        }

        if (
            eventData.status === "published" &&
            event.status === "finished"
        ) {
            throw new Error(
                "No se puede publicar un evento finalizado"
            );
        }

        if (
            eventData.status === "published" &&
            event.status === "cancelled"
        ) {
            throw new Error(
                "No se puede publicar un evento cancelado"
            );
        }
    }

    validateEventData(eventData, true);

    return await updateEventRepository(id, eventData);
};
export const publishEvent = async (id) => {
    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    if (event.status === "cancelled") {
        throw new Error(
            "No se puede publicar un evento cancelado"
        );
    }

    if (event.status === "finished") {
        throw new Error(
            "No se puede publicar un evento finalizado"
        );
    }

    if (event.date <= new Date()) {
        throw new Error(
            "No se puede publicar un evento con fecha pasada"
        );
    }

    return await updateEventRepository(id, {
        status: "published"
    });
};

export const cancelEvent = async (id) => {
    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    if (event.status === "cancelled") {
        throw new Error(
            "El evento ya está cancelado"
        );
    }

    if (event.status === "finished") {
        throw new Error(
            "No se puede cancelar un evento finalizado"
        );
    }

    return await updateEventRepository(id, {
        status: "cancelled"
    });
};