import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: Number(env.MAIL_PORT),
    secure: Number(env.MAIL_PORT) === 465,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
    }
});

export const sendConfirmationEmail = async ({
    email,
    name,
    event,
    ticket
}) => {
    const info = await transporter.sendMail({
        from: env.MAIL_FROM,
        to: email,
        subject: `Inscripción confirmada - ${event.title}`,

        text: `
Hola ${name},

Tu inscripción al evento "${event.title}" fue confirmada.

Fecha: ${new Date(event.date).toLocaleString("es-AR")}
Lugar: ${event.location}
Cantidad: ${ticket.quantity}
Código de reserva: ${ticket.reservationCode}

¡Te esperamos!
        `,

        html: `
            <h2>Inscripción confirmada</h2>

            <p>Hola ${name},</p>

            <p>
                Tu inscripción al evento
                <strong>${event.title}</strong>
                fue confirmada.
            </p>

            <ul>
                <li>
                    <strong>Fecha:</strong>
                    ${new Date(event.date).toLocaleString("es-AR")}
                </li>

                <li>
                    <strong>Lugar:</strong>
                    ${event.location}
                </li>

                <li>
                    <strong>Cantidad:</strong>
                    ${ticket.quantity}
                </li>

                <li>
                    <strong>Código de reserva:</strong>
                    ${ticket.reservationCode}
                </li>
            </ul>

            <p>¡Te esperamos!</p>
        `
    });

    return info;
};