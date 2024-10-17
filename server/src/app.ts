import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import path from "path";
import gameRoutes from "./routes/game";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import statRoutes from "./routes/stats";
import { errorHandler } from "./utils/errorHandler";
import { config } from "./config/config";
import { pool } from "./config/database";
import passport from "passport";
import "./config/passport";

const app = express();
const PgSessionStore = pgSession(session);

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(
  session({
    store: new PgSessionStore({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 72 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../client")));

app.use("/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/stats", statRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
