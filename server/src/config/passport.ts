import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { pool } from "./database";
import { findOrCreateUser } from "../models/user";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const user = await findOrCreateUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const client = await pool.connect();
        const result = await client.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: "Incorrect username." });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        const { password_hash, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(
  (user: Express.User, done: (err: any, id?: any) => void) => {
    done(null, user);
  }
);

passport.deserializeUser(
  async (
    obj: any,
    done: (err: any, user?: Express.User | false | null) => void
  ) => {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM users WHERE google_id = $1::varchar",
        [obj.google_id]
      );
      client.release();

      if (result.rows.length === 0) {
        return done(null, false);
      }

      const user = result.rows[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

export default passport;
