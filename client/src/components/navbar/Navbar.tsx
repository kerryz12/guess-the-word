import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import "./Navbar.css";

function Navbar() {
  const [wins, setWins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const storedGameState = localStorage.getItem("gameState");

    if (storedGameState) {
      const gameState = JSON.parse(storedGameState);

      if (gameState.wins !== undefined) {
        setWins(gameState.wins);
      }

      if (gameState.streak !== undefined) {
        setStreak(gameState.streak);
      }
    }

    const fetchDate = async () => {
      try {
        const response = await fetch("/api/datetime");
        const data = await response.json();

        const formattedDate = new Date(data.currentDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        setCurrentDate(formattedDate);
      } catch (error) {
        console.error("Error fetching date:", error);
      }
    };

    fetchDate();
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links-logo">
          <p>
            <a href="/">guess the word</a>
            <span>{currentDate}</span>
          </p>
        </div>
      </div>
      <div className="navbar-links_container">
        <Dialog>
          <DialogTrigger>
            <p>about</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">How to Play</DialogTitle>
              <DialogDescription className="text-lg">
                In guess the word, you're given a mystery word. Your goal is to
                figure out what it is.
                <Separator className="my-4" />
                You could try guessing what it is right away, but the odds of
                getting it would be pretty unlikely. Instead, you can also ask
                Yes or No questions to try to obtain information about the word,
                and narrow down the possibilities.
                <Separator className="my-4" />
                You win the game when you correctly guess the mystery word! For
                an added challenge, try to do it in as few guesses or in as
                little time as possible.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <p>stats</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Stats</DialogTitle>
              <DialogDescription className="text-lg">
                <div className="stats-container">
                  <Card className="card-half">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="card-title">Wins</CardTitle>
                      <Trophy className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="stats-value">{wins}</div>
                    </CardContent>
                  </Card>

                  <Card className="card-half">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="card-title">Streak</CardTitle>
                      <Flame className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="stats-value">{streak}</div>
                    </CardContent>
                  </Card>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <p>log in</p>
      </div>
    </div>
  );
}

export default Navbar;
