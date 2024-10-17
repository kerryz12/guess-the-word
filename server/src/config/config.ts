import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  groqApiKey: process.env.GROQ_API_KEY,
  groqApiUrl: "https://api.groq.com/openai/v1/chat/completions",
  wordsFilePath:
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../../src/words.json")
      : path.join(__dirname, "../words.json"),
};
