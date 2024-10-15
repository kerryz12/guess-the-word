import React, { useState, useEffect } from "react";
import { FileQuestion, Clock, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./Game.css";

const Game = () => {
  const [question, setQuestion] = useState("");
  const [guess, setGuess] = useState("");
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
      setGuesses((prevGuesses) => prevGuesses + 1);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
      setAnswer("An error occurred while processing your request");
    }
  };

  const handleGuessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess }),
      });
      const data = await response.json();
      if (data.correct) {
        setAnswer("Congratulations! You guessed the word correctly!");
        setIsGameOver(true);
      } else {
        setAnswer("Sorry, that's not the correct word. Keep guessing!");
      }
      setGuesses((prevGuesses) => prevGuesses + 1);
      setGuess("");
    } catch (error) {
      console.error("Error:", error);
      setAnswer("An error occurred while processing your guess");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="game-container">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="card-title">Mystery Word</CardTitle>
          <FileQuestion className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mystery-word">{isGameOver ? "Solved!" : "????"}</div>
          <form onSubmit={handleGuessSubmit} className="form-container mt-4">
            <div className="guess-word-container">
              <Input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Guess the word..."
                className="input-field"
                disabled={isGameOver}
              />
              <Button type="submit" className="button" disabled={isGameOver}>
                Guess <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="card-row">
        <Card className="card-half">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="card-title">Guesses</CardTitle>
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-value">{guesses}</div>
          </CardContent>
        </Card>

        <Card className="card-half">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="card-title">Time</CardTitle>
            <Clock className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-value">{formatTime(time)}</div>
          </CardContent>
        </Card>
      </div>
      <form onSubmit={handleQuestionSubmit} className="form-container">
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a yes/no question..."
          className="input-field"
          disabled={isGameOver}
        />
        <Button type="submit" className="button" disabled={isGameOver}>
          Ask
        </Button>
      </form>

      {answer && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="card-title">AI Response</CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <p>{answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Game;
