import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

let currentWord = "example";

app.post("/ask", async (req: Request, res: Response): Promise<any> => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const groqResponse = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for a word guessing game. You must only respond with "Yes", "No", or "I don't know". The current word is [INSERT_WORD_HERE].`,
          },
          { role: "user", content: question },
        ],
        max_tokens: 10,
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

app.post("/guess", (req: any, res: any) => {
  const { guess } = req.body;

  if (!guess) {
    return res.status(400).json({ error: "Guess is required" });
  }

  const correct = guess.toLowerCase() === currentWord.toLowerCase();

  res.json({ correct });
});

app.post("/set-word", (req: any, res: any) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: "Word is required" });
  }

  currentWord = word;
  res.json({ message: "New word set successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
