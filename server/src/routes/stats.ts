import express from "express";
import { updateUserStats, getUserStats, getTodayLeaderboard } from "../controllers/statsController";

const router = express.Router();

router.post("/update", updateUserStats);
router.get("/user", getUserStats);
router.get("/leaderboard", getTodayLeaderboard);

export default router;
