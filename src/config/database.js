import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URL);
        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error al conectar MongoDB:", error);
        process.exit(1);
    }
};