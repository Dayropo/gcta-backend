const express = require("express")
const router = express.Router()

const file = require("./file.route")
const user = require("./user.route")
const post = require("./post.route")

router.use("/file", file)
router.use("/user", user)
router.use("/post", post)

module.exports = router
