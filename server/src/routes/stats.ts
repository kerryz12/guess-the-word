import express from "express";
import { updateUserStats, getUserStats } from "../controllers/statsController";

const router = express.Router();

router.post("/update", updateUserStats);
router.get("/user", getUserStats);

export default router;
