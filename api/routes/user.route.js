import express from "express";
import {
  getUser,
  upDateUser,
  deleteUser,
  getNotificationNumber,
  savePost,
  getSavedPosts,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
// router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, upDateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/notification", verifyToken, getNotificationNumber);
router.post("/save", verifyToken, savePost);
router.get("/:userId/savedposts", verifyToken, getSavedPosts);
export default router;
