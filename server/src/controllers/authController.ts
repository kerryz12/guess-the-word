import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { createRegularUser } from "../models/user";

export const signup = async (req: any, res: any) => {
  try {
    const { username, email, displayName, password } = req.body;
    if (!username || !email || !displayName || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newUser = await createRegularUser(
      username,
      email,
      displayName,
      password
    );
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error || "An error occurred during signup" });
  }
};

export const signin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "An error occurred during authentication.",
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || "Authentication failed.",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "An error occurred during login." });
      }
      return res.json({
        success: true,
        message: "Authentication successful.",
        user: { id: user.id, username: user.username },
      });
    });
  })(req, res, next);
};

export const signout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
