import { Request, Response } from "express";
import axios from "axios";
import cron from "node-cron";
import path from "path";
import fs from "fs";
import { config } from "../config/config";

let currentWord = "";

function selectWordForToday(): string {
  const isProduction = process.env.NODE_ENV === "production";
  const filePath = isProduction
    ? path.join(__dirname, "../../src/words.json")
    : path.join(__dirname, "../words.json");

  const words = JSON.parse(fs.readFileSync(filePath, "utf-8")).words;
  const today = new Date();
  const index =
    (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) %
    words.length;
  return words[index];
}

function getWordForDate(date: Date): string {
  const isProduction = process.env.NODE_ENV === "production";
  const filePath = isProduction
    ? path.join(__dirname, "../../src/words.json")
    : path.join(__dirname, "../words.json");

  const words = JSON.parse(fs.readFileSync(filePath, "utf-8")).words;
  const index =
    (date.getFullYear() * 366 + date.getMonth() * 31 + date.getDate()) %
    words.length;
  return words[index];
}

function getYesterdayWord(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getWordForDate(yesterday);
}

function getTomorrowWord(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getWordForDate(tomorrow);
}

function updateCurrentWord() {
  currentWord = selectWordForToday();
  const yesterdayWord = getYesterdayWord();
  const tomorrowWord = getTomorrowWord();
  console.log(`Word updated to: ${currentWord}`);
  console.log(`Yesterday's word was: ${yesterdayWord}`);
  console.log(`Tomorrow's word will be: ${tomorrowWord}`);
}

updateCurrentWord();

cron.schedule("0 0 * * *", () => {
  updateCurrentWord();
});

export const askQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question) {
      res.status(400).json({ error: "Question is required" });
      return;
    }

    const groqResponse = await axios.post(
      config.groqApiUrl,
      {
        model: "llama-3.2-90b-text-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful word guessing game assistant. The player is trying narrow down the mystery word by asking yes or no questions.
                      If the player does not ask a yes or no question, respond with "You can only ask Yes or No questions.". 
                      Otherwise, respond with "Yes." or "No.", along with any brief additional context in case there are ambiguities in answering the user's question, such as subjectiveness.
                      Avoid using the mystery word in your response, and use generic terms to avoid giving away additional clues.
                      The mystery word is ${currentWord}.`,
          },
          { role: "user", content: question },
        ],
        max_tokens: 20,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.groqApiKey}`,
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
};

export const guessWord = (req: Request, res: Response): void => {
  const { guess } = req.body;

  if (!guess) {
    res.status(400).json({ error: "Guess is required" });
    return;
  }

  const correct = guess.toLowerCase() === currentWord.toLowerCase();

  res.json({ correct });
};

export const getDateTime = (req: Request, res: Response): void => {
  const now = new Date();
  res.json({
    currentDate: now.toDateString(),
    serverTime: Math.floor(now.getTime() / 1000),
  });
};
