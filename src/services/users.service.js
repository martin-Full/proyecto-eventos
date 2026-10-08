import { getAllUsers } from "../repositories/users.repository.js";

export const getAllUsersService = async () => {
    return await getAllUsers();
};
