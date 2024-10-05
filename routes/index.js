const express = require("express")
const router = express.Router()

const file = require("./file.route")
const user = require("./user.route")

router.use("/file", file)
router.use("/user", user)

module.exports = router
