import mongoose from "mongoose";
import crypto from "crypto";
import Event from "../models/Event.js";

import {
    createTicketRepository,
    getTicketsByUserRepository,
    getTicketsByEventRepository,
    getTicketByIdRepository,
    findActiveTicketRepository,
    cancelTicketRepository
} from "../repositories/tickets.repository.js";

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

        if (
            quantity === undefined ||
            quantity === null ||
            !Number.isInteger(Number(quantity))
        ) {
            throw new Error(
                "La cantidad debe ser un número válido"
            );
        }

        quantity = Number(quantity);

        if (quantity <= 0) {
            throw new Error(
                "La cantidad debe ser mayor a 0"
            );
        }

        const event = await Event.findById(eventId).session(session);

        // Evento inexistente
        if (!event) {
            const error = new Error("Evento no encontrado");
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
            throw new Error(
                "Ya tenés una inscripción activa para este evento"
            );
        }

        // Comprobar cupos disponibles
        const availableSeats =
            event.capacity - event.reservedSeats;

        if (availableSeats < quantity) {
            throw new Error(
                `No hay cupos suficientes. Cupos disponibles: ${availableSeats}`
            );
        }

        // Reservar cupos
        event.reservedSeats += quantity;

        await event.save({ session });

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

        await session.commitTransaction();

        return ticket;

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

        const ticket =
            await getTicketByIdRepository(ticketId);

        if (!ticket) {
            throw new Error(
                "Ticket no encontrado"
            );
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
            throw new Error(
                "El ticket ya está cancelado"
            );
        }

        const event = await Event.findById(
            ticket.event._id
        ).session(session);

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

        await event.save({ session });

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