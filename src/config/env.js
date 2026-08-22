import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET
};