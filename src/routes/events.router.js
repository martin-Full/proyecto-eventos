import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {res.status(200).json({
        status: "success",
        payload: []
    });
});

export default router;