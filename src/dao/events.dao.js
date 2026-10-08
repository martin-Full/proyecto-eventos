import Event from "../models/Event.js";

export const getAllEvents = async () => {
    return await Event.find();
};

export const createEvent = async (eventData) => {
    return await Event.create(eventData);
};

export const getEventById = async (id) => {
    return await Event.findById(id);
};

export const updateEvent = async (id, eventData) => {
    return await Event.findByIdAndUpdate(
        id,
        eventData,
        {
            new: true,
            runValidators: true
        }
    );
};

export const deleteEvent = async (id) => {
    return await Event.findByIdAndDelete(id);
};