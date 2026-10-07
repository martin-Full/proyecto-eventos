import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import {
    getUserByEmail,
    saveUser
} from "../repositories/users.repository.js";

import {
    createHash,
    isValidPassword
} from "../utils/hash.js";

import { env } from "./env.js";


export const configurePassport = () => {

    // ==========================================
    // ESTRATEGIA REGISTER
    // ==========================================

    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true
            },
            async (req, email, password, done) => {

                try {

                    const {
                        first_name,
                        last_name
                    } = req.body;

                    // Validar campos obligatorios
                    if (!first_name || !last_name || !email || !password) {
                        return done(null, false, {
                            message: "Faltan campos obligatorios"
                        });
                    }

                    // Normalizar email
                    const normalizedEmail = email
                        .trim()
                        .toLowerCase();

                    // Validar formato
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (!emailRegex.test(normalizedEmail)) {
                        return done(null, false, {
                            message: "El email no es válido"
                        });
                    }

                    // Verificar email duplicado
                    const existingUser = await getUserByEmail(
                        normalizedEmail
                    );

                    if (existingUser) {
                        return done(null, false, {
                            message: "El email ya esta registrado"
                        });
                    }

                    // Hashear contraseña
                    const hashedPassword = await createHash(password);

                    // Crear usuario
                    // No utilizamos el role enviado desde el body.
                    // El modelo asignará "user" por defecto.
                    const newUser = await saveUser({
                        first_name: first_name.trim(),
                        last_name: last_name.trim(),
                        email: normalizedEmail,
                        password: hashedPassword
                    });

                    return done(null, newUser);

                } catch (error) {

                    return done(error);
                }
            }
        )
    );


    // ==========================================
    // ESTRATEGIA LOGIN
    // ==========================================

    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            async (email, password, done) => {

                try {

                    // Validar campos
                    if (!email || !password) {
                        return done(null, false, {
                            message: "Faltan campos obligatorios"
                        });
                    }

                    // Normalizar email
                    const normalizedEmail = email
                        .trim()
                        .toLowerCase();

                    // Buscar usuario
                    const user = await getUserByEmail(
                        normalizedEmail
                    );

                    // No revelar si el email existe
                    if (!user) {
                        return done(null, false, {
                            message: "Credenciales inválidas"
                        });
                    }

                    // Comparar contraseña con bcrypt
                    const validPassword = await isValidPassword(
                        password,
                        user.password
                    );

                    if (!validPassword) {
                        return done(null, false, {
                            message: "Credenciales inválidas"
                        });
                    }

                    // Usuario autenticado correctamente
                    return done(null, user);

                } catch (error) {

                    return done(error);
                }
            }
        )
    );


    // ==========================================
    // ESTRATEGIA CURRENT
    // ==========================================

    const cookieExtractor = (req) => {

        const cookies = req.headers.cookie;

        if (!cookies) {
            return null;
        }

        const currentUserCookie = cookies
            .split(";")
            .find((cookie) =>
                cookie.trim().startsWith("currentUser=")
            );

        if (!currentUserCookie) {
            return null;
        }

        return currentUserCookie
            .split("=")
            .slice(1)
            .join("=");
    };


    passport.use(
        "current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    cookieExtractor
                ]),
                secretOrKey: env.JWT_SECRET
            },
            async (payload, done) => {

                try {

                    // Volvemos a buscar el usuario en MongoDB
                    const user = await getUserByEmail(
                        payload.email
                    );
                    
                    if (!user) {
                        return done(null, false);
                    }
                    // Passport coloca el usuario en req.user
                    return done(null, user);

                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};