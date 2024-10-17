import express from "express";
import {
  getProfile,
  getNavbarProfile,
  getUserProfile,
  editProfile,
  searchUsers,
} from "../controllers/profileController";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/edit", isAuthenticated, editProfile);
router.get("/", isAuthenticated, getProfile);
router.get("/navbar", getNavbarProfile);
router.get("/search", searchUsers);
router.get("/:username", getUserProfile);

export default router;
