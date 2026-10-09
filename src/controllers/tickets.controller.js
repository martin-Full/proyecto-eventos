import {
    createTicketService,
    getMyTicketsService,
    getEventTicketsService,
    cancelTicketService
} from "../services/tickets.service.js";

import { ticketDTO } from "../dto/ticket.dto.js";
import { sendConfirmationEmail } from "../utils/mailer.js";

export const createTicket = async (req, res) => {
    try {
        const { eid } = req.params;
        const { quantity } = req.body;

        const result = await createTicketService(
            req.user._id,
            eid,
            quantity
        );

        const ticket = result.ticket;

        let emailSent = false;

        try {
            await sendConfirmationEmail({
                email: result.user.email,
                name: `${result.user.first_name} ${result.user.last_name}`,
                event: result.event,
                ticket
            });

            emailSent = true;

        } catch (emailError) {
            console.error(
                "Error al enviar email de confirmación:",
                emailError.message
            );
        }

        res.status(201).json({
            status: "success",
            data: ticketDTO(ticket),
            emailSent
        });

    } catch (error) {
        console.error("Error al crear ticket:", error);

        res.status(error.statusCode || 400).json({
            status: "error",
            message: error.message
        });
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await getMyTicketsService(req.user._id);

        res.status(200).json({
            status: "success",
            data: tickets.map(ticketDTO)
        });

    } catch (error) {
        console.error("Error al obtener tickets:", error);

        res.status(500).json({
            status: "error",
            message: "Error al obtener tus tickets"
        });
    }
};

export const getEventTickets = async (req, res) => {
    try {
        const tickets = await getEventTicketsService(
            req.params.eid
        );

        res.status(200).json({
            status: "success",
            data: tickets.map(ticketDTO)
        });

    } catch (error) {
        console.error(
            "Error al obtener tickets del evento:",
            error
        );

        res.status(500).json({
            status: "error",
            message: "Error al obtener los tickets"
        });
    }
};

export const cancelTicket = async (req, res) => {
    try {
        const ticket = await cancelTicketService(
            req.params.tid,
            req.user._id,
            req.user.role === "admin"
        );

        res.status(200).json({
            status: "success",
            data: ticketDTO(ticket)
        });

    } catch (error) {
        console.error(
            "Error al cancelar ticket:",
            error
        );

        res.status(error.statusCode || 400).json({
            status: "error",
            message: error.message
        });
    }
};