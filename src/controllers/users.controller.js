import { getAllUsersService } from "../services/users.service.js";
import { userDTO } from "../dto/user.dto.js";

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();

        const usersDTO = users.map(userDTO);

        res.status(200).json({
            status: "success",
            payload: usersDTO
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        res.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios"
        });
    }
};