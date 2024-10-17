import { pool } from "../config/database";
import { Profile } from "passport-google-oauth20";
import bcrypt from "bcrypt";

const defaultAvatar =
  "https://res.cloudinary.com/dw258ofhq/image/upload/v1728082747/capybara_2_zbnvyu.svg";

export interface User {
  google_id: string;
  username: string;
  email: string;
  display_name: string;
  profile_picture?: string;
  bio?: string;
  public_posts: boolean;
  password_hash?: string;
}

export const findOrCreateUser = async (profile: Profile) => {
  const client = await pool.connect();
  try {
    const res: any = await client.query(
      "SELECT * FROM users WHERE google_id = $1",
      [profile.id]
    );

    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      const insertRes = await client.query(
        "INSERT INTO users (google_id, display_name, email, profile_picture, username) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          profile.id,
          profile.displayName,
          profile.emails ? profile.emails[0].value : null,
          profile.photos ? profile.photos[0].value : null,
          profile.emails ? profile.emails[0].value.split("@")[0] : null, // strip domain from email and use it as username
        ]
      );
      return insertRes.rows[0];
    }
  } finally {
    client.release();
  }
};

export const createRegularUser = async (
  username: string,
  email: string,
  displayName: string,
  password: string
) => {
  const client = await pool.connect();
  try {
    const existingUser = await client.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("Username or email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertRes = await client.query(
      "INSERT INTO users (username, email, display_name, password_hash, profile_picture) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, email, displayName, hashedPassword, defaultAvatar]
    );

    const { password_hash, ...newUser } = insertRes.rows[0];

    const updateID = await client.query(
      "UPDATE users SET google_id = id WHERE google_id is null or google_id = '' AND username = $1",
      [username]
    );

    return newUser;
  } finally {
    client.release();
  }
};
