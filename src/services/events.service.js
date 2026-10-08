import {
    getEvents,
    createEventRepository,
    getEventByIdRepository,
    updateEventRepository,
    deleteEventRepository
} from "../repositories/events.repository.js";

export const getAllEvents = async () => {
    return await getEvents();
};

export const createEventService = async (eventData) => {
    return await createEventRepository(eventData);
};

export const getEventByIdService = async (id) => {
    return await getEventByIdRepository(id);
};

export const updateEventService = async (id, eventData) => {
    return await updateEventRepository(id, eventData);
};

export const deleteEventService = async (id) => {
    return await deleteEventRepository(id);
};