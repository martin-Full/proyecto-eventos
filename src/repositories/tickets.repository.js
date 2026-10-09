import {
    createTicket,
    getTicketsByUser,
    getTicketsByEvent,
    getTicketById,
    findActiveTicket,
    cancelTicket
} from "../dao/tickets.dao.js";

export const createTicketRepository = async (
    ticketData,
    session = null
) => {
    return await createTicket(ticketData, session);
};

export const getTicketsByUserRepository = async (userId) => {
    return await getTicketsByUser(userId);
};

export const getTicketsByEventRepository = async (eventId) => {
    return await getTicketsByEvent(eventId);
};

export const getTicketByIdRepository = async (ticketId) => {
    return await getTicketById(ticketId);
};

export const findActiveTicketRepository = async (
    userId,
    eventId,
    session = null
) => {
    return await findActiveTicket(
        userId,
        eventId,
        session
    );
};

export const cancelTicketRepository = async (
    ticketId,
    session = null
) => {
    return await cancelTicket(
        ticketId,
        session
    );
};