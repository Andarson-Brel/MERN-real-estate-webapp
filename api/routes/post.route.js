import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  savePost,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

// Define routes
router.post("/savePost", savePost);
router.get("/:userId/posts", getUserPosts);

export default router;
