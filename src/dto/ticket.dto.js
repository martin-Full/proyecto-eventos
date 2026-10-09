export const ticketDTO = (ticket) => {
    if (!ticket) return null;

    const event = ticket.event;
    const user = ticket.user;

    return {
        id: ticket._id,

        user: user?.email
            ? {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
            : user,

        event: event?.title
            ? {
                id: event._id,
                title: event.title,
                date: event.date,
                location: event.location
            }
            : event,

        status: ticket.status,
        quantity: ticket.quantity,
        reservationCode: ticket.reservationCode,
        createdAt: ticket.createdAt,
        cancelledAt: ticket.cancelledAt
    };
};