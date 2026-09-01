import { Router } from "express";
import {
    getSessions,
    registerUser,
    loginUser
} from "../controllers/sessions.controller.js";

const router = Router();

router.get("/", getSessions);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;