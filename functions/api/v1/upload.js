const express = require('express')
const upload = require('../../middleware/upload')
const resize = require('../../middleware/resize')
const router = express.Router()

router.post('/upload', upload, resize)

module.exports = router
