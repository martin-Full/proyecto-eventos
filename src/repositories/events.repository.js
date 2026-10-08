import {
    getAllEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent
} from "../dao/events.dao.js";

export const getEvents = async () => {
    return await getAllEvents();
};

export const createEventRepository = async (eventData) => {
    return await createEvent(eventData);
};

export const getEventByIdRepository = async (id) => {
    return await getEventById(id);
};

export const updateEventRepository = async (id, eventData) => {
    return await updateEvent(id, eventData);
};

export const deleteEventRepository = async (id) => {
    return await deleteEvent(id);
};