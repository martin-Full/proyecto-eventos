import {
    registerUser as registerUserService,
    loginUser as loginUserService
} from "../services/sessions.service.js";

export const getSessions = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Sessions endpoint disponible"
    });
};

export const registerUser = async (req, res) => {
    try {
        const user = await registerUserService(req.body);

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
    } catch (error) {
        if (error.message === "El email ya esta registrado") {
            return res.status(409).json({
                status: "error",
                message: error.message
            });
        }

        if (error.message === "Faltan campos obligatorios") {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

        if (error.message === "El email no es valido") {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

        console.error("Error al registrar usuario:", error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { user, token } = await loginUserService(req.body);

        res.cookie("currentUser", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({
            status: "success",
            message: "Login correcto"
        });
    } catch (error) {
        if (error.message === "Faltan campos obligatorios") {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

        if (error.message === "Credenciales invalidas") {
            return res.status(401).json({
                status: "error",
                message: error.message
            });
        }

        console.error("Error al iniciar sesion:", error);

        res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
};
export const getCurrentUser = (req, res) => {
    res.status(200).json({
        status: "success",
        payload: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
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