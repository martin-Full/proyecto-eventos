import {
    getUserByEmail,
    saveUser
} from "../repositories/users.repository.js";

import {
    createHash,
    isValidPassword
} from "../utils/hash.js";

import { generateToken } from "../utils/jwt.js";

export const registerUser = async ({
    first_name,
    last_name,
    email,
    password
}) => {
    if (!first_name || !last_name || !email || !password) {
        throw new Error("Faltan campos obligatorios");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
        throw new Error("El email no es válido");
    }
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
        throw new Error("El email ya esta registrado");
    }
    const hashedPassword = await createHash(password);
    const newUser = await saveUser({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: normalizedEmail,
        password: hashedPassword
    });
    return newUser;
};
export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Faltan campos obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
        throw new Error("Credenciales invalidas");
    }

    const validPassword = await isValidPassword(
        password,
        user.password
    );

    if (!validPassword) {
        throw new Error("Credenciales invalidas");
    }

    const tokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    const token = generateToken(tokenPayload);

    return {
        user,
        token
    };
};