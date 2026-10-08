import Event from "../models/Event.js";

export const getAllEvents = async ({
    filters = {},
    page = 1,
    limit = 10,
    sort = "date"
}) => {
    const skip = (page - 1) * limit;

    const allowedSortFields = [
        "date",
        "title",
        "price",
        "capacity"
    ];

    const sortField = allowedSortFields.includes(sort)
        ? sort
        : "date";

    const [events, total] = await Promise.all([
        Event.find(filters)
            .sort({ [sortField]: 1 })
            .skip(skip)
            .limit(limit)
            .populate("organizer", "first_name last_name email"),

        Event.countDocuments(filters)
    ]);

    return {
        events,
        total
    };
};

export const createEvent = async (eventData) => {
    return await Event.create(eventData);
};

export const getEventById = async (id) => {
    return await Event.findById(id)
        .populate("organizer", "first_name last_name email");
};

export const updateEvent = async (id, eventData) => {
    return await Event.findByIdAndUpdate(
        id,
        eventData,
        {
            new: true,
            runValidators: true
        }
    ).populate("organizer", "first_name last_name email");
};