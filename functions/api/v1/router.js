const handleError = require('../../middleware/errors')
const logRequest = require('../../middleware/log')
const addScales = require('../../middleware/scales')
const scalesRouter = require('./scales')
const uploadRouter = require('./upload')
const router = require('express').Router()

router.use(logRequest)
router.use(addScales)
router.use(scalesRouter)
router.use(uploadRouter)
router.use(handleError)

module.exports = router
