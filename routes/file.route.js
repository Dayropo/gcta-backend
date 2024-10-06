const express = require("express")
const router = express.Router()
const multer = require("multer")

const { upload, deleteFile } = require("../controllers/file.controller")

const storage = multer.memoryStorage()
const uploadFile = multer({ storage: storage })

router.post("/upload", uploadFile.single("file"), upload)
router.delete("/delete/:file", deleteFile)

module.exports = router
