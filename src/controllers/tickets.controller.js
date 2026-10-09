import {
    createTicketService,
    getMyTicketsService,
    getEventTicketsService,
    cancelTicketService
} from "../services/tickets.service.js";

import User from "../models/User.js";
import { sendConfirmationEmail } from "../utils/mailer.js";


export const createTicket = async (req, res) => {
    try {
        const { eid } = req.params;
        const { quantity } = req.body;

        const ticket = await createTicketService(
            req.user._id,
            eid,
            quantity
        );

        const user = await User.findById(req.user._id);

        const populatedTicket = await ticket.populate(
            "event",
            "title date location"
        );

        let emailSent = false;

        try {
            await sendConfirmationEmail({
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                event: populatedTicket.event,
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
            data: ticket,
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
            data: tickets
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
            data: tickets
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
            data: ticket
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