import express from "express";
import {
  askQuestion,
  guessWord,
  getDateTime,
  askQuestionGemini,
} from "../controllers/gameController";

const router = express.Router();

router.post("/ask", askQuestion);
router.post("/askGemini", askQuestionGemini);
router.post("/guess", guessWord);
router.get("/datetime", getDateTime);

export default router;
