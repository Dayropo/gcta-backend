const express = require("express")
const { createPost, getAllPosts } = require("../controllers/post.controller")
const { verifyToken } = require("../middleware/verifyToken")
const router = express.Router()

router.post("/create", verifyToken, createPost)
router.get("/all", getAllPosts)

module.exports = router
