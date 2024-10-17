import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import path from "path";
import cron from "node-cron";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../client")));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

let currentWord = "";

function selectWordForToday(): string {
  const isProduction = process.env.NODE_ENV === "production";
  const filePath = isProduction
    ? path.join(__dirname, "../src/words.json")
    : path.join(__dirname, "words.json");

  const words = JSON.parse(fs.readFileSync(filePath, "utf-8")).words;
  const today = new Date();
  const index =
    (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) %
    words.length;
  return words[index];
}

function updateCurrentWord() {
  currentWord = selectWordForToday();
  console.log(`Word updated to: ${currentWord}`);
}

updateCurrentWord();

cron.schedule("0 0 * * *", () => {
  updateCurrentWord();
});

app.get("/api/getword", async (req: Request, res: Response): Promise<any> => {
  res.json(currentWord);
});

app.get("/api/datetime", (req, res) => {
  const now = new Date();
  res.json({
    currentDate: now.toDateString(),
    serverTime: Math.floor(now.getTime() / 1000),
  });
});

app.post("/api/ask", async (req: Request, res: Response): Promise<any> => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const groqResponse = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: "llama-3.2-90b-text-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful word guessing game assistant. The user is trying to guess the mystery word and can ask yes or no questions to attempt to narrow it down.
                      Respond only with "Yes." or "No." except in the following cases. In the case there are ambiguities in the answer to the user's question, such as due to unknown variables,
                      please respond with either a short sentence clarifying any assumptions in your answer, or "I'm not sure.". Do not include the actual word in this response, and use generic 
                      terms to avoid giving away additional clues. In the case the user does not ask a yes or no question, please respond with "You can only ask Yes or No questions.". 
                      The current word is ${currentWord}.`,
          },
          { role: "user", content: question },
        ],
        max_tokens: 20,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = groqResponse.data.choices[0].message.content.trim();

    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

app.post("/api/guess", (req: any, res: any) => {
  const { guess } = req.body;

  if (!guess) {
    return res.status(400).json({ error: "Guess is required" });
  }

  const correct = guess.toLowerCase() === currentWord.toLowerCase();

  res.json({ correct });
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
