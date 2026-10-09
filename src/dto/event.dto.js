export const eventDTO = (event) => {
    if (!event) return null;

    return {
        id: event._id,
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        reservedSeats: event.reservedSeats,
        price: event.price,
        status: event.status,
        organizer: event.organizer?._id || event.organizer
    };
};