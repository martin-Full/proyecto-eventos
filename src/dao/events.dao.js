import Event from "../models/Event.js";

export const getAllEvents = async () => {
    return await Event.find();
};