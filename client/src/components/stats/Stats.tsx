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
import { Flame, Trophy, Target } from "lucide-react";
import { Loader, Leaderboard } from "..";

import "./Stats.css";

interface UserStats {
  wins: number;
  streak: number;
  max_streak: number;
}

interface StatsDialogProps {
  isAuthenticated: boolean;
}

const Stats = ({ isAuthenticated }: StatsDialogProps) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

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
                    <Card className="stats-card-half">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="stats-card-title">Wins</CardTitle>
                        <Trophy className="h-6 w-6 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="stats-value">{stats?.wins || 0}</div>
                      </CardContent>
                    </Card>

                    <Card className="stats-card-half">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="stats-card-title">
                          Streak
                        </CardTitle>
                        <Flame className="h-6 w-6 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="stats-value">{stats?.streak || 0}</div>
                      </CardContent>
                    </Card>

                    <Card className="stats-card-half">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="stats-card-title">
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
  );
};

export default Stats;
