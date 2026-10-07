import { Router } from "express";
import passport from "passport";

import {
    getSessions,
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
} from "../controllers/sessions.controller.js";

const router = Router();

router.get("/", getSessions);

router.post(
    "/register",
    (req, res, next) => {
        passport.authenticate(
            "register",
            { session: false },
            (error, user, info) => {
                if (error) {
                    return next(error);
                }

                if (!user) {
                    if (info?.message === "Faltan campos obligatorios") {
                        return res.status(400).json({
                            status: "error",
                            message: info.message
                        });
                    }

                    if (info?.message === "El email no es válido") {
                        return res.status(400).json({
                            status: "error",
                            message: info.message
                        });
                    }

                    if (info?.message === "El email ya esta registrado") {
                        return res.status(409).json({
                            status: "error",
                            message: info.message
                        });
                    }

                    return res.status(400).json({
                        status: "error",
                        message: "No se pudo registrar el usuario"
                    });
                }

                req.user = user;
                next();
            }
        )(req, res, next);
    },
    registerUser
);

router.post(
    "/login",
    (req, res, next) => {
        passport.authenticate(
            "login",
            { session: false },
            (error, user, info) => {
                if (error) {
                    return next(error);
                }

                if (!user) {
                    if (info?.message === "Faltan campos obligatorios") {
                        return res.status(400).json({
                            status: "error",
                            message: info.message
                        });
                    }

                    return res.status(401).json({
                        status: "error",
                        message: "Credenciales inválidas"
                    });
                }

                req.user = user;
                next();
            }
        )(req, res, next);
    },
    loginUser
);

router.get(
    "/current",
    (req, res, next) => {
        passport.authenticate(
            "current",
            { session: false },
            (error, user) => {
                if (error) {
                    return next(error);
                }

                if (!user) {
                    return res.status(401).json({
                        status: "error",
                        message: "No autenticado"
                    });
                }

                req.user = user;
                next();
            }
        )(req, res, next);
    },
    getCurrentUser
);

router.post("/logout", logoutUser);

export default router;