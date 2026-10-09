import mongoose from "mongoose";
import crypto from "crypto";

import {
    createTicketRepository,
    getTicketsByUserRepository,
    getTicketsByEventRepository,
    getTicketByIdRepository,
    findActiveTicketRepository,
    cancelTicketRepository
} from "../repositories/tickets.repository.js";

import {
    getEventByIdWithSessionRepository,
    saveEventWithSessionRepository,
    getEventByIdRepository
} from "../repositories/events.repository.js";

import {
    getUserByIdRepository
} from "../repositories/users.repository.js";


const generateReservationCode = () => {
    return crypto.randomBytes(8).toString("hex").toUpperCase();
};


export const createTicketService = async (
    userId,
    eventId,
    quantity
) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        // Validar cantidad
        if (
            quantity === undefined ||
            quantity === null ||
            !Number.isInteger(Number(quantity))
        ) {
            const error = new Error(
                "La cantidad debe ser un número válido"
            );

            error.statusCode = 400;

            throw error;
        }

        quantity = Number(quantity);

        if (quantity <= 0) {
            const error = new Error(
                "La cantidad debe ser mayor a 0"
            );

            error.statusCode = 400;

            throw error;
        }


        // Buscar evento mediante Repository
        const event =
            await getEventByIdWithSessionRepository(
                eventId,
                session
            );


        // Evento inexistente
        if (!event) {

            const error = new Error(
                "Evento no encontrado"
            );

            error.statusCode = 404;

            throw error;
        }


        // Evento no publicado
        if (event.status !== "published") {

            const error = new Error(
                "Solo podés inscribirte a eventos publicados"
            );

            error.statusCode = 400;

            throw error;
        }


        // Evento finalizado
        if (event.date <= new Date()) {

            const error = new Error(
                "No podés inscribirte a un evento finalizado"
            );

            error.statusCode = 400;

            throw error;
        }


        // Evitar inscripción duplicada activa
        const existingTicket =
            await findActiveTicketRepository(
                userId,
                eventId,
                session
            );


        if (existingTicket) {

            const error = new Error(
                "Ya tenés una inscripción activa para este evento"
            );

            error.statusCode = 409;

            throw error;
        }


        // Comprobar cupos disponibles
        const availableSeats =
            event.capacity - event.reservedSeats;


        if (availableSeats < quantity) {

            const error = new Error(
                `No hay cupos suficientes. Cupos disponibles: ${availableSeats}`
            );

            error.statusCode = 409;

            throw error;
        }


        // Reservar cupos
        event.reservedSeats += quantity;

        await saveEventWithSessionRepository(
            event,
            session
        );


        // Crear ticket
        const ticket =
            await createTicketRepository(
                {
                    user: userId,
                    event: eventId,
                    status: "confirmed",
                    quantity,
                    reservationCode:
                        generateReservationCode()
                },
                session
            );


        // Obtener usuario mediante Repository
        const user =
            await getUserByIdRepository(userId);


        if (!user) {

            const error = new Error(
                "Usuario no encontrado"
            );

            error.statusCode = 404;

            throw error;
        }


        await session.commitTransaction();


        // Obtener evento con los datos necesarios
        // para la confirmación por email
        const populatedEvent =
            await getEventByIdRepository(eventId);


        return {
            ticket,
            user,
            event: populatedEvent
        };

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();
    }
};


export const getMyTicketsService = async (userId) => {

    return await getTicketsByUserRepository(userId);

};


export const getEventTicketsService = async (eventId) => {

    return await getTicketsByEventRepository(eventId);

};


export const cancelTicketService = async (
    ticketId,
    userId,
    isAdmin = false
) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();


        // Buscar ticket
        const ticket =
            await getTicketByIdRepository(ticketId);


        if (!ticket) {

            const error = new Error(
                "Ticket no encontrado"
            );

            error.statusCode = 404;

            throw error;
        }


        // Owner o admin
        if (
            !isAdmin &&
            ticket.user._id.toString() !== userId.toString()
        ) {

            const error = new Error(
                "No tenés permisos para cancelar este ticket"
            );

            error.statusCode = 403;

            throw error;
        }


        // No cancelar dos veces
        if (ticket.status === "cancelled") {

            const error = new Error(
                "El ticket ya está cancelado"
            );

            error.statusCode = 409;

            throw error;
        }


        // Buscar evento mediante Repository
        const event =
            await getEventByIdWithSessionRepository(
                ticket.event._id,
                session
            );


        if (!event) {

            const error = new Error(
                "Evento no encontrado"
            );

            error.statusCode = 404;

            throw error;
        }


        // Liberar cupos
        event.reservedSeats -= ticket.quantity;


        if (event.reservedSeats < 0) {
            event.reservedSeats = 0;
        }


        await saveEventWithSessionRepository(
            event,
            session
        );


        // Cancelar ticket sin eliminarlo
        const cancelledTicket =
            await cancelTicketRepository(
                ticketId,
                session
            );


        await session.commitTransaction();


        return cancelledTicket;

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();
    }
};