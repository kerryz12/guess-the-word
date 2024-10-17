import express from "express";
import passport from "passport";
import { signup, signin, signout } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.get("/logout", signout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
