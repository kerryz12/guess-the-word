import { pool } from "../config/database";

export const updateUserStats = async (req: any, res: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { guesses, time } = req.body;
  const user_id = req.user.google_id;

  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const todayCompletionCheck = await client.query(
        `SELECT * FROM completions 
         WHERE user_id = $1 
         AND DATE(date AT TIME ZONE 'UTC') = CURRENT_DATE AT TIME ZONE 'UTC'`,
        [user_id]
      );

      if (todayCompletionCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO completions (user_id, guesses, time)
           VALUES ($1, $2, $3)`,
          [user_id, guesses, time]
        );

        await client.query(
          `INSERT INTO stats (user_id, wins, streak, last_played)
           VALUES ($1, 1, 1, NOW() AT TIME ZONE 'UTC')
           ON CONFLICT (user_id)
           DO UPDATE SET
             wins = stats.wins + 1,
             streak = CASE
               WHEN DATE(stats.last_played AT TIME ZONE 'UTC') = (CURRENT_DATE AT TIME ZONE 'UTC' - INTERVAL '1 day')
               THEN stats.streak + 1
               ELSE 1
             END,
           RETURNING *`,
          [user_id]
        );

        await client.query(
          `UPDATE stats
           SET last_played = NOW() AT TIME ZONE 'UTC'
           WHERE user_id = $1`,
          [user_id]
        );

        await client.query(
          `UPDATE stats
           SET max_streak = GREATEST(max_streak, streak)
           WHERE user_id = $1`,
          [user_id]
        );

        await client.query("COMMIT");
      }

      res.status(200).json({
        message: "Stats updated successfully",
      });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error updating user stats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserStats = async (req: any, res: any) => {
  try {
    if (req.isAuthenticated()) {
      const user_id = (req.user as any).google_id;

      const result = await pool.query(
        "SELECT wins, streak, max_streak FROM stats WHERE user_id = $1",
        [user_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const stats = result.rows[0];

      res.status(200).json({ stats });
    }
  } catch (err) {
    console.error("Error fetching user profile: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodayLeaderboard = async (req: any, res: any) => {
  try {
    const client = await pool.connect();

    try {
      const leaderboardQuery = `
      SELECT 
        u.username, 
        u.profile_picture, 
        c.guesses, 
        c.time
      FROM 
        completions c
      JOIN 
        users u ON c.user_id = u.google_id
      WHERE 
        DATE(c.date AT TIME ZONE 'UTC') = CURRENT_DATE AT TIME ZONE 'UTC'
      ORDER BY 
        c.guesses ASC, 
        c.time ASC
      LIMIT 30
    `;

      const result = await client.query(leaderboardQuery);

      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
