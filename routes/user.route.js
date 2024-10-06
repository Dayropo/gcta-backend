const express = require("express")
const { register, login, getUser, logout, getUsers } = require("../controllers/user.controller")
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/", getUser)
router.post("/logout", logout)
router.get("/all", getUsers)

module.exports = router
