import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader } from "..";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/stats/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setLeaderboardData(data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="leaderboard-container mx-auto p-4">
      <h2 className="text-2xl">Today's Leaderboard</h2>
      <div className="leaderboard-rows-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Guesses</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry: any, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex items-center">
                  <img
                    src={entry.profile_picture}
                    alt={`${entry.username}'s profile`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {entry.username}
                </TableCell>
                <TableCell>{entry.guesses}</TableCell>
                <TableCell>{formatTime(entry.time)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const formatTime = (time: any) => {
  const hours = time.hours || "0";
  const minutes = time.minutes || "0";
  const seconds = time.seconds || "0";
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

export default Leaderboard;
