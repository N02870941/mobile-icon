const express = require('express')
const resize = require('../../middleware/resize')
const setup = require('../../middleware/setup')
const upload = require('../../middleware/upload')
const router = express.Router()

router.post('/upload', upload, setup, resize)

module.exports = router
