import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Flame, Trophy, User, LogOut, ChevronDown, Target } from "lucide-react";
import { Loader, Leaderboard } from "..";

import "./Navbar.css";

interface UserStats {
  wins: number;
  streak: number;
  max_streak: number;
}

function Navbar() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [displayName, setDisplayName] = useState<string>(() => {
    return localStorage.getItem("displayName") || "";
  });

  const [profilePicture, setProfilePicture] = useState<string>(() => {
    return localStorage.getItem("profilePicture") || "";
  });

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`/api/profile/navbar`, {
        credentials: "include",
      });

      const data = await response.json();
      setDisplayName(data.username);
      setProfilePicture(data.profilePicture);
      setIsAuthenticated(data.isAuthenticated);

      localStorage.setItem(
        "isAuthenticated",
        data.isAuthenticated ? "true" : "false"
      );
      localStorage.setItem("displayName", data.username || "");
      localStorage.setItem("profilePicture", data.profilePicture || "");
    } catch (err) {
      console.error("Failed to fetch profile details: ", err);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("displayName");
      localStorage.removeItem("profilePicture");
    }
  };

  const redirectUser = (url: string) => {
    location.href = url;
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await fetch("/api/game/datetime", {
          credentials: "include",
        });
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

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) {
        setStats(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/stats/user", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user stats");
        }
        const data = await response.json();
        setStats(data.stats);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        throw new Error("Failed to fetch user stats");
      }
    };

    fetchStats();
  }, [isAuthenticated]);

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
            <p>how to play</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">How to Play</DialogTitle>
              <DialogDescription className="text-lg">
                In guess the word, you're given a mystery word. Your goal is to
                figure out what it is.
                <Separator className="my-4" />
                You could try guessing what it is right away, but the odds of
                you getting it would be pretty unlikely. Instead, you can also
                ask Yes or No questions to try to obtain information about the
                word, and narrow down the possibilities.
                <Separator className="my-4" />
                You win the game when you correctly guess the mystery word! For
                an added challenge, try to do it in as few guesses or in as
                little time as possible.
                <Separator className="my-4" />
                The mystery word changes every day at 00:00 UTC.
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
                {isAuthenticated ? (
                  loading ? (
                    <Loader />
                  ) : (
                    <div className="stats-container">
                      <div className="user-stats-container">
                        <Card className="card-half">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="card-title">Wins</CardTitle>
                            <Trophy className="h-6 w-6 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="stats-value">
                              {stats?.wins || 0}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="card-half">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="card-title">Streak</CardTitle>
                            <Flame className="h-6 w-6 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="stats-value">
                              {stats?.streak || 0}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="card-half">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="card-title">
                              Max Streak
                            </CardTitle>
                            <Target className="h-6 w-6 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="stats-value">
                              {stats?.max_streak || 0}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Leaderboard />
                    </div>
                  )
                ) : (
                  <p>Log in to see your stats!</p>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {!isAuthenticated && (
          <p>
            <a href="/login">login</a>
          </p>
        )}
      </div>
      {isAuthenticated && (
        <div className="navbar-profile">
          <DropdownMenu>
            <img src={profilePicture} alt="profile" />
            <DropdownMenuTrigger asChild>
              <div className="navbar-profile-name">
                <p>{displayName}</p>
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => redirectUser("/user/" + displayName)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => redirectUser(`/auth/logout`)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export default Navbar;
