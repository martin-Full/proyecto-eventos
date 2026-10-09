import Ticket from "../models/Ticket.js";

export const createTicket = async (
    ticketData,
    session = null
) => {
    const options = session ? { session } : {};

    const [ticket] = await Ticket.create(
        [ticketData],
        options
    );

    return ticket;
};

export const getTicketsByUser = async (userId) => {
    return await Ticket.find({
        user: userId
    })
        .populate("event", "title date location")
        .sort({ createdAt: -1 });
};

export const getTicketsByEvent = async (eventId) => {
    return await Ticket.find({
        event: eventId
    })
        .populate("user", "first_name last_name email")
        .sort({ createdAt: -1 });
};

export const getTicketById = async (ticketId) => {
    return await Ticket.findById(ticketId)
        .populate(
            "event",
            "title date location organizer"
        )
        .populate(
            "user",
            "first_name last_name email"
        );
};

export const findActiveTicket = async (
    userId,
    eventId,
    session = null
) => {
    const query = Ticket.findOne({
        user: userId,
        event: eventId,
        status: {
            $in: ["confirmed", "pending"]
        }
    });

    if (session) {
        query.session(session);
    }

    return await query;
};

export const cancelTicket = async (
    ticketId,
    session = null
) => {
    return await Ticket.findByIdAndUpdate(
        ticketId,
        {
            status: "cancelled",
            cancelledAt: new Date()
        },
        {
            new: true,
            runValidators: true,
            ...(session ? { session } : {})
        }
    );
};