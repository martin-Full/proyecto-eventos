import { generateToken } from "../utils/jwt.js";

export const getSessions = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Sessions endpoint disponible"
    });
};

export const registerUser = (req, res) => {
    const user = req.user;

    res.status(201).json({
        status: "success",
        payload: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
    });
};

export const loginUser = (req, res) => {
    const user = req.user;

    const tokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    const token = generateToken(tokenPayload);

    res.cookie("currentUser", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600000,
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({
        status: "success",
        message: "Login correcto",
         payload: {
        token
    }
    });
};

export const getCurrentUser = (req, res) => {
    const user = req.user;

    res.status(200).json({
        status: "success",
        payload: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    });
};

export const logoutUser = (req, res) => {
    res.clearCookie("currentUser", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({
        status: "success",
        message: "Sesión cerrada"
    });
};