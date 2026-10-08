import { getAllUsersService } from "../services/users.service.js";

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();

        res.status(200).json({
            status: "success",
            payload: users
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        res.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios"
        });
    }
};