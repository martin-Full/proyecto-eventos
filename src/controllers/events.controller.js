import { getAllEvents } from "../services/events.service.js";

export const getEvents = async (req, res) => {
    try {
        const events = await getAllEvents();

        res.status(200).json({
            status: "success",
            payload: events
        });
    } catch (error) {
        console.error("Error al obtener eventos:", error);

        res.status(500).json({
            status: "error",
            message: "Error al obtener los eventos"
        });
    }
};