import React, { useState, useEffect, useCallback } from "react";
import {
  FileQuestion,
  Clock,
  MessageSquare,
  Send,
  MessageCircleQuestion,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Confetti from "react-confetti";
import { Loader } from "..";
import "./Game.css";

const Game = () => {
  const [question, setQuestion] = useState("");
  const [guess, setGuess] = useState("");
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [solvedWord, setSolvedWord] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [jump, setJump] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingReply, setLoadingReply] = useState(false);
  const [serverDate, setServerDate] = useState("");

  const fetchServerDateTime = async () => {
    try {
      const response = await fetch("/api/game/datetime", {
        credentials: "include",
      });
      const data = await response.json();
      return {
        currentDate: data.currentDate,
        serverTime: data.serverTime,
      };
    } catch (error) {
      console.error("Error fetching server date/time:", error);
      return {
        currentDate: new Date().toDateString(),
        serverTime: Math.floor(Date.now() / 1000),
      };
    }
  };

  const resetGame = useCallback(() => {
    setGuesses(0);
    setTime(0);
    setIsGameOver(false);
    setSolvedWord("");
    setAnswer("");
    localStorage.removeItem("gameState");
  }, []);

  const saveGameState = useCallback(async () => {
    const gameState = {
      guesses,
      time,
      isGameOver,
      solvedWord,
      savedDate: serverDate,
      lastSolvedDate: serverDate,
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [guesses, time, isGameOver, solvedWord]);

  const loadGameState = useCallback(async () => {
    const gameState = localStorage.getItem("gameState");
    const { currentDate } = await fetchServerDateTime();
    setServerDate(currentDate);

    if (gameState) {
      const { guesses, time, isGameOver, solvedWord, savedDate } =
        JSON.parse(gameState);

      const today = new Date(currentDate);
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastPlayed = new Date(savedDate);

      if (today.toDateString() !== lastPlayed.toDateString()) {
        resetGame();
      } else {
        setGuesses(guesses);
        setTime(time);
        setIsGameOver(isGameOver);
        setSolvedWord(solvedWord);
      }
    }

    setIsLoading(false);
  }, [resetGame]);

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  useEffect(() => {
    if (!isLoading) {
      saveGameState();
    }
  }, [isLoading, saveGameState]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isGameOver && !isLoading) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameOver, isLoading]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingReply(true);
    try {
      const response = await fetch("/api/game/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
        credentials: "include",
      });
      const data = await response.json();
      setAnswer(data.answer);
      setGuesses((prevGuesses) => prevGuesses + 1);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
      setAnswer("An error occurred while processing your request");
    } finally {
      setLoadingReply(false);
    }
  };

  const handleGuessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/game/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.correct) {
        setAnswer("Congratulations! You guessed the word correctly!");
        setIsGameOver(true);
        setSolvedWord(guess);
        setShowConfetti(true);
        setJump(true);
        setGuess("");
        setTimeout(() => setShowConfetti(false), 10000);
        setTimeout(() => setJump(false), 2000);
        updateUserStats(guesses + 1);
      } else {
        setAnswer("Sorry, that's not the correct word. Keep guessing!");
        triggerShake();
      }
      setGuesses((prevGuesses) => prevGuesses + 1);
    } catch (error) {
      console.error("Error:", error);
      setAnswer("An error occurred while processing your guess");
    }
  };

  const updateUserStats = async (guesses: number) => {
    try {
      const response = await fetch("/api/stats/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guesses,
          time,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to update user stats");
      }
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setGuess("");
    }, 600);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="game-container">
      {showConfetti && <Confetti />}
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

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="card-title">Mystery Word</CardTitle>
          <FileQuestion className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`mystery-word ${shake ? "shake" : ""} ${
              jump ? "jump" : ""
            }`}
            style={{
              color: isGameOver ? "green" : "",
            }}
          >
            {isGameOver ? solvedWord : guess || "?"}
          </div>
          <form onSubmit={handleGuessSubmit} className="form-container mt-4">
            <div className="guess-word-container">
              <Input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Guess the word..."
                className="input-field"
                disabled={isGameOver}
                maxLength={16}
              />
              <Button type="submit" className="button" disabled={isGameOver}>
                Guess <Send className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="my-6">
        <CardHeader>
          <CardTitle className="card-title">Ask Questions</CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          {loadingReply ? <Loader /> : <p>{answer}</p>}
        </CardContent>
        <form onSubmit={handleQuestionSubmit} className="form-container">
          <div className="ask-question-container">
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a yes/no question..."
              className="input-field"
              disabled={isGameOver}
              maxLength={64}
            />
            <Button type="submit" className="button" disabled={isGameOver}>
              Ask <MessageCircleQuestion className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Game;
