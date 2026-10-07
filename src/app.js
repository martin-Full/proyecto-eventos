import express from "express";
import passport from "passport";

import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import { configurePassport } from "./config/passport.config.js";

const app = express();

app.use(express.json());

configurePassport();

app.use(passport.initialize());

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

export default app;