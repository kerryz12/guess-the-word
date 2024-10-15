import React, { useState, useEffect } from "react";
import { FileQuestion, Clock, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./Game.css";

const Game = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuesses((prevGuesses) => prevGuesses + 1);
    setAnswer("The AI's response would appear here.");
    setQuestion("");
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
          <div className="mystery-word">?????</div>
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

      <form onSubmit={handleSubmit} className="form-container">
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a yes/no question..."
          className="input-field"
        />
        <Button type="submit" className="button">
          Ask
        </Button>
      </form>

      {answer && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="card-title">Response</CardTitle>
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
