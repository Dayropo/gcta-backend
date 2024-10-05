const express = require("express")
const { register, login, getUser, logout } = require("../controllers/user.controller")
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/", getUser)
router.post("/logout", logout)

module.exports = router
