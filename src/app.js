import express from "express";
import passport from "passport";

import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import ticketsRouter from "./routes/tickets.router.js";

import { configurePassport } from "./config/passport.config.js";

const app = express();

app.use(express.json());
app.use("/api", ticketsRouter);


configurePassport();

app.use(passport.initialize());

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

export default app;