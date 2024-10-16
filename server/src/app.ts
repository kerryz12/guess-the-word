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

let currentWord = "beaver";

app.get("/getword", async (req: Request, res: Response): Promise<any> => {
  res.json(currentWord);
});

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
            content: `You are a helpful assistant for a word guessing game. 
                      Every day, a new random word is chosen, and the user can ask you yes or no questions to attempt to narrow down the word. The user's goal is to guess the word. 
                      You must only respond with "Yes", "No", or "I'm not sure", unless there are multiple definitions for the word 
                      which raise ambiguities in the answer to the user's question, or unless the question is not a Yes or No question.
                      In the case that there are ambiguities, please feel free to respond with a short, single sentence providing any assumptions
                      in the answer you provide the user. In the case the user does not ask a yes or no question, please respond by telling the
                      user that they should only ask Yes or No questions. The current word is ${currentWord}.`,
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

app.post("/setword", (req: any, res: any) => {
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
