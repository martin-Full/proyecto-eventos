import { getEvents } from "../repositories/events.repository.js";

export const getAllEvents = async () => {
    return await getEvents();
};