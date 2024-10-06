const express = require("express")
const {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} = require("../controllers/post.controller")
const { verifyToken } = require("../middleware/verifyToken")
const router = express.Router()

router.post("/create", verifyToken, createPost)
router.get("/", getAllPosts)
router.get("/:slug", getPostBySlug)
router.put("/:slug", verifyToken, updatePost)
router.delete("/:slug", verifyToken, deletePost)

module.exports = router
