const download = require('../../middleware/download')
const resize = require('../../middleware/resize')
const setup = require('../../middleware/setup')
const upload = require('../../middleware/upload')
const zip = require('../../middleware/zip')
const router = require('express').Router()

router.post('/upload', upload, setup, resize, zip, download)

module.exports = router
