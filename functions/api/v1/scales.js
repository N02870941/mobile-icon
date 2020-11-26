const router = require('express').Router()

router.get('/scales', (req, res) =>  res.json(req.scales))

module.exports = router
