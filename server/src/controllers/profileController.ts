import { Request, Response } from "express";
import { pool } from "../config/database";

export const getProfile = async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user_id = (req.user as any).google_id;
    try {
      const result = await pool.query(
        `SELECT * FROM users WHERE google_id=$1::varchar`,
        [user_id]
      );
      const {
        username,
        profile_picture,
        display_name,
        email,
        bio,
        public_posts,
      } = result.rows[0];
      res.json({
        username,
        profilePicture: profile_picture,
        displayName: display_name,
        email,
        bio,
        publicPosts: public_posts,
        isAuthenticated: true,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.json({ isAuthenticated: false });
  }
};

export const getNavbarProfile = async (req: any, res: any) => {
  if (!req.session) {
    return res.status(500).json({ message: "Session not initialized" });
  }

  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      username: (req.user as any).username || null,
      profilePicture: (req.user as any).profile_picture || null,
    });
  } else {
    res.json({
      isAuthenticated: false,
      username: null,
      profilePicture: null,
    });
  }
};

export const getUserProfile = async (req: any, res: any) => {
  const { username } = req.params;
  let isOwnProfile = false;

  try {
    if (req.isAuthenticated()) {
      const user_id = (req.user as any).google_id;

      const result = await pool.query(
        "SELECT google_id, username, display_name, bio, profile_picture FROM users WHERE username = $1",
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const profile = result.rows[0];

      if (profile.google_id === user_id) {
        isOwnProfile = true;
      }

      res.status(200).json({ profile, isAuthenticated: true, isOwnProfile });
    } else {
      const result = await pool.query(
        "SELECT username, display_name, bio, profile_picture FROM users WHERE username = $1",
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        profile: result.rows[0],
        isAuthenticated: false,
        isOwnProfile,
      });
    }
  } catch (err) {
    console.error("Error fetching user profile: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsers = async (req: any, res: any) => {
  try {
    const { query, offset = 0, limit = 10 }: any = req.query;

    if (!query || query.length < 2) {
      return res
        .status(400)
        .json({ message: "Query must be at least 2 characters" });
    }

    const offsetValue = parseInt(offset, 10);
    const limitValue = parseInt(limit, 10);

    const result = await pool.query(
      `SELECT username, profile_picture FROM users WHERE username ILIKE $1 ORDER BY username LIMIT $2 OFFSET $3`,
      [`%${query}%`, limitValue, offsetValue]
    );

    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editProfile = async (req: any, res: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user_id = (req.user as any).google_id;
  const username = req.body.username;
  const display_name = req.body.displayName;
  const bio = req.body.bio;
  const public_posts = req.body.public_posts;

  try {
    const result = await pool.query(
      `UPDATE users 
        SET username=COALESCE(NULLIF($1, ''), username), 
        display_name=COALESCE(NULLIF($2, ''), display_name), 
        bio=COALESCE(NULLIF($3, ''), bio),
        public_posts=$5
        WHERE $4=google_id`,
      [username, display_name, bio, user_id, public_posts]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
