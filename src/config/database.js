import mongoose from "mongoose";
import dns from "dns";

import { env } from "./env.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URL);

        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error al conectar MongoDB:", error);
        process.exit(1);
    }
};