const express = require('express')
const logRequest = require('../../middleware/log')
const addScale = require('../../middleware/scale')
const scaleRouter = require('./scale')
const uploadRouter = require('./upload')
const router = express.Router()

router.use(logRequest)
router.use(addScale)
router.use(scaleRouter)
router.use(uploadRouter)

module.exports = router
