import express from "express";
import {
  askQuestion,
  guessWord,
  getDateTime,
} from "../controllers/gameController";

const router = express.Router();

router.post("/ask", askQuestion);
router.post("/guess", guessWord);
router.get("/datetime", getDateTime);

export default router;
