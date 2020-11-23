const express = require('express')
const logRequest = require('../../middleware/log')
const addScales = require('../../middleware/scales')
const scalesRouter = require('./scales')
const uploadRouter = require('./upload')
const router = express.Router()

router.use(logRequest)
router.use(addScales)
router.use(scalesRouter)
router.use(uploadRouter)

module.exports = router