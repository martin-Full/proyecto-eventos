import {
    getAllEvents,
    createEvent,
    getEventById,
    updateEvent,
    getEventByIdWithSession,
    saveEventWithSession
} from "../dao/events.dao.js";

export const getEvents = async (options) => {
    return await getAllEvents(options);
};

export const createEventRepository = async (eventData) => {
    return await createEvent(eventData);
};

export const getEventByIdRepository = async (id) => {
    return await getEventById(id);
};

export const updateEventRepository = async (
    id,
    eventData
) => {
    return await updateEvent(id, eventData);
};

export const getEventByIdWithSessionRepository = async (
    id,
    session
) => {
    return await getEventByIdWithSession(
        id,
        session
    );
};

export const saveEventWithSessionRepository = async (
    event,
    session
) => {
    return await saveEventWithSession(
        event,
        session
    );
};