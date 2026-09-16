import { verifyToken } from "../utils/jwt.js";

export const auth = (req, res, next) => {
    try {
        const cookies = req.headers.cookie;

        if (!cookies) {
            return res.status(401).json({
                status: "error",
                message: "No autenticado"
            });
        }

        const currentUserCookie = cookies
            .split(";")
            .find((cookie) => cookie.trim().startsWith("currentUser="));

        if (!currentUserCookie) {
            return res.status(401).json({
                status: "error",
                message: "No autenticado"
            });
        }

        const token = currentUserCookie
            .split("=")
            .slice(1)
            .join("=");

        const payload = verifyToken(token);

        req.user = payload;

        next();
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "No autenticado"
        });
    }
};