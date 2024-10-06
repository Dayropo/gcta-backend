const express = require("express")
const { createPost, getAllPosts, getPostBySlug } = require("../controllers/post.controller")
const { verifyToken } = require("../middleware/verifyToken")
const router = express.Router()

router.post("/create", verifyToken, createPost)
router.get("/", getAllPosts)
router.get("/:slug", getPostBySlug)

module.exports = router
